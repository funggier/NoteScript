import fs from "node:fs";
import path from "node:path";
import { NoteScriptError } from "../error.js";

export function resolveSoundPackDirectory(soundRef, songFile, portableRoot = null) {
  const raw = soundRef.trim();
  const songDir = path.dirname(path.resolve(songFile));

  if (raw.toLowerCase().startsWith("pack:")) {
    const explicit = raw.slice(5).trim();
    const explicitPath = path.resolve(songDir, explicit);
    if (!fs.existsSync(path.join(explicitPath, "pack.md"))) {
      throw new NoteScriptError("Sound pack not found: " + explicitPath);
    }
    return explicitPath;
  }

  const candidates = [
    path.join(songDir, "sounds", raw),
    portableRoot ? path.join(portableRoot, "sounds", raw) : null
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "pack.md"))) return candidate;
  }

  throw new NoteScriptError(
    'Sound add-on "' + raw + '" was not found. Copy its folder into a sounds directory and keep pack.md inside it.'
  );
}

export function listSoundAddons(soundRoots) {
  const addons = [];
  const seen = new Set();

  for (const soundRoot of soundRoots) {
    if (!soundRoot || !fs.existsSync(soundRoot)) continue;
    for (const entry of fs.readdirSync(soundRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const directory = path.join(soundRoot, entry.name);
      if (!fs.existsSync(path.join(directory, "pack.md"))) continue;
      const key = path.resolve(directory).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      addons.push({ name: entry.name, directory });
    }
  }

  return addons.sort((a, b) => a.name.localeCompare(b.name));
}
