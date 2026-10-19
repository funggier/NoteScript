import fs from "node:fs";
import path from "node:path";
import { parseSong } from "../parser.js";
import { renderToWav } from "../renderer.js";
import { exportMidi } from "../midi.js";
import { listSoundAddons } from "../sound/resolver.js";
import { listInstrumentAddons } from "../instrument/addon.js";
import { NoteScriptError } from "../error.js";

function safeName(name) {
  const value = String(name || "").trim();
  if (!value || value === "." || value === ".." || /[\\/:*?"<>|]/.test(value)) {
    throw new NoteScriptError("Invalid project name.");
  }
  return value;
}

function assertInside(root, candidate) {
  const base = path.resolve(root);
  const target = path.resolve(candidate);
  const rel = path.relative(base, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new NoteScriptError("Path is outside the NoteScript portable workspace.");
  }
  return target;
}

export function createControlService(programRoot) {
  const root = path.resolve(programRoot);
  const projectsRoot = path.join(root, "projects");
  const exportsRoot = path.join(root, "exports");
  const soundsRoot = path.join(root, "sounds");
  const instrumentsRoot = path.join(root, "instruments");

  for (const dir of [projectsRoot, exportsRoot, soundsRoot, instrumentsRoot]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  function resolveProject(fileOrName) {
    if (!fileOrName) throw new NoteScriptError("Project file is required.");
    const raw = String(fileOrName);
    const candidate = path.isAbsolute(raw) ? raw : path.join(projectsRoot, raw);
    return assertInside(projectsRoot, candidate);
  }

  function loadProject(fileOrName) {
    const file = resolveProject(fileOrName);
    if (!fs.existsSync(file)) throw new NoteScriptError("Project does not exist: " + file);
    return { file, markdown: fs.readFileSync(file, "utf8") };
  }

  return {
    root,
    health() {
      return {
        ok: true,
        service: "NoteScript Control API",
        apiVersion: "v1",
        coreVersion: "0.1.0",
        portableRoot: root
      };
    },

    listProjects() {
      return fs.readdirSync(projectsRoot, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));
    },

    saveProject(name, markdown) {
      const base = safeName(name);
      const filename = base.toLowerCase().endsWith(".md") ? base : base + ".md";
      const file = assertInside(projectsRoot, path.join(projectsRoot, filename));
      const parsed = parseSong(String(markdown));
      fs.writeFileSync(file, String(markdown), "utf8");
      return { file, title: parsed.title, tracks: parsed.tracks.length };
    },

    validateProject(fileOrName) {
      const { file, markdown } = loadProject(fileOrName);
      const song = parseSong(markdown);
      return {
        valid: true,
        file,
        title: song.title,
        tempo: song.config.tempo,
        tracks: song.tracks.length
      };
    },

    listSounds(fileOrName = null) {
      const roots = [soundsRoot];
      if (fileOrName) {
        const file = resolveProject(fileOrName);
        roots.unshift(path.join(path.dirname(file), "sounds"));
      }
      return listSoundAddons(roots);
    },

    listInstruments(fileOrName = null) {
      const roots = [instrumentsRoot];
      if (fileOrName) {
        const file = resolveProject(fileOrName);
        roots.unshift(path.join(path.dirname(file), "instruments"));
      }
      return listInstrumentAddons(roots);
    },

    renderProject(fileOrName, outputName = null) {
      const { file, markdown } = loadProject(fileOrName);
      const song = parseSong(markdown);
      const stem = outputName ? safeName(outputName) : path.basename(file, path.extname(file));
      const filename = stem.toLowerCase().endsWith(".wav") ? stem : stem + ".wav";
      const output = assertInside(exportsRoot, path.join(exportsRoot, filename));
      return renderToWav(song, file, output, { portableRoot: root });
    },

    exportMidi(fileOrName, outputName = null) {
      const { file, markdown } = loadProject(fileOrName);
      const song = parseSong(markdown);
      const stem = outputName ? safeName(outputName) : path.basename(file, path.extname(file));
      const filename = stem.toLowerCase().endsWith(".mid") ? stem : stem + ".mid";
      const output = assertInside(exportsRoot, path.join(exportsRoot, filename));
      return { outputFile: exportMidi(song, output) };
    }
  };
}
