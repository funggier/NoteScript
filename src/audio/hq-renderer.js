// Streaming high-quality PCM24 stereo renderer for pitched SoundPiano/SoundPad and SFZ.
// Uses original optional masters/<sample-name> WAV when present, with no external decoder.
import fs from "node:fs";
import path from "node:path";
import { compileTimeline, quarterToSeconds } from "../timeline.js";
import { loadSoundPack, resolvePitchedSample } from "../sound/pack.js";
import { resolveSoundPackDirectory } from "../sound/resolver.js";
import { loadInstrumentAddon, resolveInstrumentAddon } from "../instrument/addon.js";
import { parseSfzFile, selectSfzRegions, sfzPitchRatio, dbToGain } from "../instrument/sfz.js";
import { NoteScriptError } from "../error.js";

const MAX_WAV_DATA = 0xFFFFFFFF - 36;
const CHUNK_SECONDS = 2;
const MAX_RESAMPLED_SECONDS = 35;

function readStereoPcm(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new NoteScriptError("HQ Render requires PCM WAV: " + file);
  }
  let offset = 12, fmt = null, start = -1, bytes = 0;
  while (offset + 8 <= buffer.length) {
    const kind = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const at = offset + 8;
    if (at + size > buffer.length) throw new NoteScriptError("Invalid WAV chunk: " + file);
    if (kind === "fmt " && size >= 16) fmt = {
      format: buffer.readUInt16LE(at),
      channels: buffer.readUInt16LE(at + 2),
      rate: buffer.readUInt32LE(at + 4),
      bits: buffer.readUInt16LE(at + 14)
    };
    if (kind === "data") { start = at; bytes = size; }
    offset = at + size + size % 2;
  }
  if (!fmt || start < 0 || ![1,2].includes(fmt.channels) ||
      !(fmt.format === 1 && [16,24,32].includes(fmt.bits)) &&
      !(fmt.format === 3 && fmt.bits === 32)) {
    throw new NoteScriptError("HQ Render supports mono/stereo PCM16/24/32 or Float32 WAV: " + file);
  }
  const stride = fmt.channels * fmt.bits / 8;
  const frames = Math.floor(bytes / stride);
  if (frames > fmt.rate * MAX_RESAMPLED_SECONDS) {
    throw new NoteScriptError("HQ source sample exceeds 35 seconds: " + file);
  }
  const left = new Float32Array(frames), right = new Float32Array(frames);
  function sample(i) {
    if (fmt.format === 3) return buffer.readFloatLE(i);
    if (fmt.bits === 16) return buffer.readInt16LE(i) / 32768;
    if (fmt.bits === 32) return buffer.readInt32LE(i) / 2147483648;
    return ((buffer[i] | buffer[i+1] << 8 | buffer[i+2] << 16) << 8 >> 8) / 8388608;
  }
  const step = fmt.bits / 8;
  for (let i = 0; i < frames; i++) {
    left[i] = sample(start + i * stride);
    right[i] = fmt.channels === 2 ? sample(start + i * stride + step) : left[i];
  }
  return { left, right, rate: fmt.rate, frames };
}

function sinc(x) { return Math.abs(x) < 1e-10 ? 1 : Math.sin(Math.PI*x)/(Math.PI*x); }

function convertRate(audio, rate) {
  if (audio.rate === rate) return { ...audio, sampleRate: rate };
  const n = Math.max(1, Math.round(audio.frames * rate / audio.rate));
  const l = new Float32Array(n), r = new Float32Array(n);
  const ratio = audio.rate / rate;
  const cutoff = Math.min(1, rate / audio.rate) * 0.97;
  const radius = Math.min(72, Math.ceil(12 / cutoff));
  for (let i = 0; i < n; i++) {
    const pos = i * ratio, center = Math.floor(pos);
    let ls=0,rs=0,weightSum=0;
    for (let p = Math.max(0, center-radius+1); p <= Math.min(audio.frames-1, center+radius); p++) {
      const dist = p-pos, t = Math.abs(dist) / radius;
      const window = t < 1 ? 0.5+0.5*Math.cos(Math.PI*t) : 0;
      const weight = cutoff*sinc(cutoff*dist)*window;
      ls += audio.left[p]*weight;
      rs += audio.right[p]*weight;
      weightSum += weight;
    }
    if (weightSum) { l[i]=ls/weightSum;r[i]=rs/weightSum; }
  }
  return { left:l, right:r, frames:n, sampleRate:rate };
}

function cubic(a,b,c,d,t) {
  return b + 0.5*t*(c-a+t*(2*a-5*b+4*c-d+t*(3*(b-c)+d-a)));
}
function stereoAt(sample, position) {
  const base = Math.floor(position), t = position - base, last = sample.frames-1;
  const a=Math.max(0,base-1),b=Math.max(0,Math.min(base,last));
  const c=Math.min(last,base+1),d=Math.min(last,base+2);
  return [
    cubic(sample.left[a],sample.left[b],sample.left[c],sample.left[d],t),
    cubic(sample.right[a],sample.right[b],sample.right[c],sample.right[d],t)
  ];
}

function preferMaster(file) {
  const candidate = path.join(path.dirname(file), "masters", path.basename(file));
  return fs.existsSync(candidate) ? candidate : file;
}

function buildEvents(song, songFile, portableRoot, sampleRate) {
  const timeline = compileTimeline(song);
  const sampleCache = new Map(),packCache=new Map(),instCache=new Map();
  let mastersUsed = 0;
  function load(file) {
    const original = preferMaster(file);
    if (!sampleCache.has(original)) {
      const audio=convertRate(readStereoPcm(original),sampleRate);
      sampleCache.set(original,audio);
      if(original!==file)mastersUsed++;
    }
    return sampleCache.get(original);
  }
  function pack(id) {
    const dir=resolveSoundPackDirectory(id,songFile,portableRoot);
    if(!packCache.has(dir))packCache.set(dir,loadSoundPack(dir));
    return packCache.get(dir);
  }
  function instrument(id) {
    const dir=resolveInstrumentAddon(id,songFile,portableRoot);
    if(!instCache.has(dir)) {
      const addon=loadInstrumentAddon(dir);
      if(addon.format!=="SFZ") throw new NoteScriptError(
        "HQ Render supports SoundPiano, SoundPad and SFZ. Use standard Render for "+addon.format+" instruments.");
      instCache.set(dir,parseSfzFile(addon.entryPath));
    }
    return instCache.get(dir);
  }
  const jobs=[];
  for(const track of timeline.tracks) {
    const trackPan=Math.max(-1,Math.min(1,Number(track.pan)||0));
    for(const event of track.events) {
      const start=Math.round(quarterToSeconds(event.startQuarter,song.config.tempo)*sampleRate);
      const frames=Math.max(1,Math.round(quarterToSeconds(event.durationQuarter,song.config.tempo)*sampleRate));
      const volume=track.volume * event.velocity / 127;
      const sounds=[];
      if(track.instrument) {
        if(event.kind!=="note") throw new NoteScriptError("HQ SFZ tracks need pitched notes.");
        for(const region of selectSfzRegions(instrument(track.instrument),event.note,event.velocity)) {
          sounds.push({
            sample:load(region.sampleFile),ratio:sfzPitchRatio(region,event.note),
            gain:volume*dbToGain(region.volumeDb),offset:region.offset,
            sourceEnd:region.end,attack:region.attackSeconds,release:region.releaseSeconds,
            pan:Math.max(-1,Math.min(1,trackPan+(region.pan||0)/100))
          });
        }
      } else {
        const sound=pack(track.sound);
        let file,ratio=1;
        if(event.kind==="note") {
          if(sound.type!=="pitched")throw new NoteScriptError("Notes require pitched SoundPiano: "+sound.name);
          const match=resolvePitchedSample(sound,event.note);
          if(!match)throw new NoteScriptError("Unmapped note in "+sound.name);
          file=match.file;
          ratio=Math.pow(2,(event.note-match.rootNote)/12);
        } else if(event.kind==="trigger") {
          if(sound.type!=="soundpad")throw new NoteScriptError("Triggers require SoundPad: "+sound.name);
          file=sound.triggers.get(event.trigger);
          if(!file)throw new NoteScriptError("Missing trigger: "+event.trigger);
        }
        if(file)sounds.push({sample:load(file),ratio,gain:volume,offset:0,sourceEnd:null,attack:0,release:0,pan:trackPan});
      }
      for(const sound of sounds) {
        const { sample,ratio }=sound;
        const sourceEnd=sound.sourceEnd==null ? sample.frames : Math.min(sample.frames,sound.sourceEnd+1);
        const sourceOffset=Math.min(sourceEnd-1,Math.max(0,sound.offset));
        const available=Math.floor((sourceEnd-sourceOffset)/ratio);
        const release=sound.release ? Math.round(sound.release*sampleRate) : 0;
        const count=Math.min(available,frames+release);
        if(count<=0)continue;
        jobs.push({...sound,start,end:start+count,frames,release,available:count,
          offset:sourceOffset,attack:sound.attack?Math.round(sound.attack*sampleRate):0});
      }
    }
  }
  return {jobs:jobs.sort((a,b)=>a.start-b.start),endQuarter:timeline.endQuarter,mastersUsed};
}

function writeHeader(fd, rate, frames) {
  const dataSize=frames*2*3;
  if(dataSize>MAX_WAV_DATA)throw new NoteScriptError(
    "HQ WAV exceeds RIFF 4 GiB limit. Export a shorter song or lower rate.");
  const b=Buffer.alloc(44);
  b.write("RIFF",0);b.writeUInt32LE(36+dataSize,4);b.write("WAVE",8);
  b.write("fmt ",12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);
  b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*6,28);
  b.writeUInt16LE(6,32);b.writeUInt16LE(24,34);b.write("data",36);
  b.writeUInt32LE(dataSize,40);fs.writeSync(fd,b);
}
function writeInt24(b,i,value) {
  const n=Math.max(-8388608,Math.min(8388607,Math.round(value < 0 ? value*8388608 : value*8388607)));
  b[i]=n&255;b[i+1]=(n>>8)&255;b[i+2]=(n>>16)&255;
}
function renderPass(jobs,frameCount,rate,scale,fd,onProgress,phase) {
  const chunk=Math.round(rate*CHUNK_SECONDS);
  let active=[],idx=0,peak=0;
  for(let chunkStart=0;chunkStart<frameCount;chunkStart+=chunk) {
    const end=Math.min(frameCount,chunkStart+chunk),len=end-chunkStart;
    const l=new Float64Array(len),r=new Float64Array(len);
    while(idx<jobs.length && jobs[idx].start<end) active.push(jobs[idx++]);
    const next=[];
    for(const e of active) {
      const begin=Math.max(chunkStart,e.start),stop=Math.min(end,e.end);
      if(stop>begin) {
        const p=e.pan;
        const leftGain=p>0?1-p:1;
        const rightGain=p<0?1+p:1;
        const fade=Math.min(Math.floor(rate*.02),Math.floor(e.available/4));
        const attack=e.attack?Math.min(e.attack,e.available):fade;
        const release=e.release?Math.min(e.release,e.available):fade;
        for(let f=begin;f<stop;f++) {
          const relative=f-e.start,sourcePosition=e.offset+relative*e.ratio;
          const [left,right]=stereoAt(e.sample,sourcePosition);
          let envelope=1;
          if(attack && relative<attack)envelope*=relative/attack;
          if(e.release){
            if(relative>=e.frames)envelope*=Math.max(0,1-(relative-e.frames)/Math.max(1,release));
          } else if(release && relative>=e.available-release){
            envelope*=Math.max(0,(e.available-relative-1)/release);
          }
          const w=e.gain*envelope;
          l[f-chunkStart]+=left*w*leftGain;
          r[f-chunkStart]+=right*w*rightGain;
        }
      }
      if(e.end>end)next.push(e);
    }
    active=next;
    const out=fd==null?null:Buffer.allocUnsafe(len*6);
    for(let i=0;i<len;i++) {
      peak=Math.max(peak,Math.abs(l[i]),Math.abs(r[i]));
      if(out) {
        writeInt24(out,i*6,l[i]*scale);
        writeInt24(out,i*6+3,r[i]*scale);
      }
    }
    if(out) fs.writeSync(fd,out);
    if(onProgress && ((chunkStart/chunk)%15===0 || end===frameCount)){
      onProgress(Math.min(100,(phase*50)+(end/frameCount)*50));
    }
  }
  return peak;
}

/**
 * Renders PCM24 stereo in small constant-size chunks. Does not change the Piano/live renderer.
 * Audio sources are native PCM WAV; 192 kHz/32-bit stereo masters are preferred if installed.
 * Uses a two-pass scan to avoid clipping and preserve track dynamics.
 */
export function renderHighQualityToWav(song,songFile,outputFile,options={}) {
  const rate=Number(options.sampleRate??48000);
  if(![48000,96000].includes(rate))throw new NoteScriptError("HQ sample rate must be 48000 or 96000 Hz.");
  const root=options.portableRoot?path.resolve(options.portableRoot):null;
  const {jobs,endQuarter,mastersUsed}=buildEvents(song,songFile,root,rate);
  const seconds=quarterToSeconds(endQuarter,song.config.tempo)+(options.tailSeconds??0);
  const frames=Math.max(1,Math.ceil(seconds*rate));
  if(frames*6>MAX_WAV_DATA)throw new NoteScriptError(
    "HQ WAV exceeds RIFF 4 GiB; lower sample rate or shorten the project.");
  const onProgress=typeof options.onProgress==="function"?options.onProgress:null;
  const peak=renderPass(jobs,frames,rate,1,null,onProgress,0);
  const scale=peak>0.98?0.98/peak:1;
  const output=path.resolve(outputFile);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  const fd=fs.openSync(output,"wx");
  try {
    writeHeader(fd,rate,frames);
    renderPass(jobs,frames,rate,scale,fd,onProgress,1);
  } catch(error) {
    fs.closeSync(fd);
    fs.rmSync(output,{force:true});
    throw error;
  }
  fs.closeSync(fd);
  return {outputFile:output,durationSeconds:frames/rate,sampleRate:rate,bitsPerSample:24,
    channels:2,tracks:song.tracks.length,peakBeforeNormalization:peak,mastersUsed,events:jobs.length,
    bytes:fs.statSync(output).size};
}
