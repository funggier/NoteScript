#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseSong } from "./parser.js";
import { renderToWav } from "./renderer.js";
import { exportMidi } from "./midi.js";
import { loadSoundPack } from "./sound/pack.js";
import { listSoundAddons } from "./sound/resolver.js";
import { listInstrumentAddons, loadInstrumentAddon } from "./instrument/addon.js";
import { getDecoderCapabilities } from "./audio/decoder.js";
import { getFluidSynthCapabilities } from "./instrument/fluidsynth.js";
import { NoteScriptError } from "./error.js";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const programRoot = process.env.NOTESCRIPT_ROOT ? path.resolve(process.env.NOTESCRIPT_ROOT) : sourceRoot;

function usage() {
  console.log([
    "NoteScript v0.1",
    "",
    "Usage:",
    "  notescript capabilities",
    "  notescript validate <song.md>",
    "  notescript validate-pack <folder>",
    "  notescript validate-instrument <folder>",
    "  notescript list-sounds [song.md]",
    "  notescript list-instruments [song.md]",
    "  notescript render <song.md> [-o output.wav]",
    "  notescript preview <song.md>",
    "  notescript midi <song.md> [-o output.mid]",
    "",
    "Sound add-on usage:",
    "  sound: MySoundPack",
    "  searches <song-folder>/sounds/MySoundPack then <portable>/sounds/MySoundPack",
    "  explicit paths remain available as sound: pack:<relative-folder>",
    "",
    "Instrument add-on usage:",
    "  instrument: SFZ/SalamanderGrandPiano",
    "  portable layout: instruments/SFZ/<name>, instruments/SF2/<name>, instruments/SF3/<name>",
    "",
    "Audio rendering is deterministic and uses local sound packs."
  ].join("\n"));
}

function option(args, shortName, longName) {
  const index = args.findIndex((arg) => arg === shortName || arg === longName);
  if (index >= 0) return args[index + 1];
  return null;
}

function loadSong(file) {
  const resolved = path.resolve(file);
  const markdown = fs.readFileSync(resolved, "utf8");
  return { file: resolved, song: parseSong(markdown) };
}

function previewWindows(file) {
  if (process.platform !== "win32") return false;
  const result = spawnSync("cmd.exe", ["/d", "/s", "/c", "start", "", file], {
    windowsHide: true,
    stdio: "ignore"
  });
  return result.status === 0;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  if (!command || command === "-h" || command === "--help" || command === "help") {
    usage();
    return;
  }

  if (command === "capabilities") {
    console.log(JSON.stringify({
      decoders: getDecoderCapabilities(),
      fluidsynth: getFluidSynthCapabilities(programRoot)
    }, null, 2));
    return;
  }

  if (command === "validate") {
    if (!args[1]) throw new NoteScriptError("validate requires a song file.");
    const { song } = loadSong(args[1]);
    console.log('VALID: "' + song.title + '" | tracks=' + song.tracks.length + " | tempo=" + song.config.tempo);
    return;
  }

  if (command === "list-sounds") {
    const roots = [];
    if (args[1]) roots.push(path.join(path.dirname(path.resolve(args[1])), "sounds"));
    roots.push(path.join(programRoot, "sounds"));
    const addons = listSoundAddons(roots);
    if (addons.length === 0) {
      console.log("No sound add-ons found.");
    } else {
      for (const addon of addons) console.log(addon.name + " -> " + addon.directory);
    }
    return;
  }

  if (command === "list-instruments") {
    const roots = [];
    if (args[1]) roots.push(path.join(path.dirname(path.resolve(args[1])), "instruments"));
    roots.push(path.join(programRoot, "instruments"));
    const addons = listInstrumentAddons(roots);
    if (addons.length === 0) {
      console.log("No instrument add-ons found.");
    } else {
      for (const addon of addons) console.log(addon.id + " -> " + addon.directory);
    }
    return;
  }

  if (command === "validate-instrument") {
    if (!args[1]) throw new NoteScriptError("validate-instrument requires an instrument folder.");
    const addon = loadInstrumentAddon(path.resolve(args[1]));
    console.log(
      'VALID INSTRUMENT: "' + addon.name + '" | id=' + addon.id +
      " | format=" + addon.format + " | entry=" + addon.entry
    );
    return;
  }

  if (command === "validate-pack") {
    if (!args[1]) throw new NoteScriptError("validate-pack requires a pack folder.");
    const pack = loadSoundPack(path.resolve(args[1]));
    console.log(
      'VALID PACK: "' + pack.name + '" | type=' + pack.type +
      " | pitched=" + pack.samples.size + " | triggers=" + pack.triggers.size
    );
    return;
  }

  if (command === "render" || command === "preview") {
    if (!args[1]) throw new NoteScriptError(command + " requires a song file.");
    const { file, song } = loadSong(args[1]);
    const defaultOut = command === "preview"
      ? path.join(path.dirname(file), ".notescript-preview.wav")
      : path.join(process.cwd(), path.basename(file, path.extname(file)) + ".wav");
    const output = option(args, "-o", "--output") || defaultOut;
    if (path.extname(output).toLowerCase() !== ".wav") {
      throw new NoteScriptError("Baseline renderer writes WAV. Use an .wav output path.");
    }
    const report = renderToWav(song, file, output, { portableRoot: programRoot });
    console.log(
      "RENDERED: " + report.outputFile +
      " | " + report.durationSeconds.toFixed(2) + "s | " + report.sampleRate + " Hz"
    );
    if (command === "preview") {
      if (previewWindows(report.outputFile)) console.log("PREVIEW: opened in the Windows default audio player.");
      else console.log("PREVIEW FILE: " + report.outputFile);
    }
    return;
  }

  if (command === "midi") {
    if (!args[1]) throw new NoteScriptError("midi requires a song file.");
    const { file, song } = loadSong(args[1]);
    const output = option(args, "-o", "--output") ||
      path.join(process.cwd(), path.basename(file, path.extname(file)) + ".mid");
    console.log("MIDI: " + exportMidi(song, output));
    return;
  }

  throw new NoteScriptError('Unknown command "' + command + '".');
}

main().catch((error) => {
  if (error instanceof NoteScriptError) {
    console.error("NoteScript error: " + error.message);
    process.exitCode = 2;
    return;
  }
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
