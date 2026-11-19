#!/usr/bin/env node
// Import user-owned Uki Guitar PCM32 recordings as portable 48kHz PCM16 stereo WAVs.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (!process.argv[2]) {
  console.error("Usage: node scripts/import-uki-guitar.js <folder-containing-UKI-01..UKI-06.wav>");
  process.exit(2);
}
const source = path.resolve(process.argv[2]);
const destination = path.join(root, "examples", "sounds", "soundpiano", "uki-guitar");
if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
  throw new Error("Uki Guitar source folder not found: " + source);
}
const filenames = ["UKI-01.wav","UKI-02.wav","UKI-03.wav","UKI-04.wav","UKI-05.wav","UKI-06.wav"];
for (const name of filenames) {
  if (!fs.existsSync(path.join(source,name))) throw new Error("Missing recording: " + name);
}
fs.mkdirSync(destination,{recursive:true});
for (const name of filenames) {
  const input = path.join(source,name);
  const output = path.join(destination,name);
  const result = spawnSync("ffmpeg", ["-hide_banner","-loglevel","error","-nostdin","-y",
    "-i",input,"-ar","48000","-ac","2","-c:a","pcm_s16le",output],
    {encoding:"utf8",windowsHide:true});
  if (result.status!==0) throw new Error("Audio conversion failed for "+name+": "+result.stderr);
  console.log(name+" -> "+path.relative(root,output)+" ("+fs.statSync(output).size+" bytes)");
}
