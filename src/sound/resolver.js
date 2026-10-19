import fs from "node:fs";
import path from "node:path";
import { NoteScriptError } from "../error.js";

export const SOUND_CATEGORIES = Object.freeze(["soundpiano", "soundpad"]);

function packExists(directory) {
  return fs.existsSync(path.join(directory, "pack.md"));
}

function categoryCandidates(root, raw) {
  const candidates = [path.join(root, raw)];
  for (const category of SOUND_CATEGORIES) {
    candidates.push(path.join(root, category, raw));
  }
  return candidates;
}

export function resolveSoundPackDirectory(soundRef, songFile, portableRoot = null) {
  const raw = soundRef.trim();
  const songDir = path.dirname(path.resolve(songFile));

  if (raw.toLowerCase().startsWith("pack:")) {
    const explicit = raw.slice(5).trim();
    const explicitPath = path.resolve(songDir, explicit);
    if (!packExists(explicitPath)) {
      throw new NoteScriptError("Sound pack not found: " + explicitPath);
    }
    return explicitPath;
  }

  const roots = [
    path.join(songDir, "sounds"),
    portableRoot ? path.join(portableRoot, "sounds") : null
  ].filter(Boolean);

  for (const root of roots) {
    for (const candidate of categoryCandidates(root, raw)) {
      if (packExists(candidate)) return candidate;
    }
  }

  throw new NoteScriptError(
    'Sound add-on "' + raw + '" was not found. Copy it into sounds/soundpiano/<pack> or sounds/soundpad/<pack>.'
  );
}

function discoverRoot(soundRoot, addons, seen) {
  if (!soundRoot || !fs.existsSync(soundRoot)) return;

  for (const entry of fs.readdirSync(soundRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(soundRoot, entry.name);
    const lower = entry.name.toLowerCase();

    if (SOUND_CATEGORIES.includes(lower)) {
      for (const packEntry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (!packEntry.isDirectory()) continue;
        const packDirectory = path.join(directory, packEntry.name);
        if (!packExists(packDirectory)) continue;
        const key = path.resolve(packDirectory).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        addons.push({
          name: packEntry.name,
          directory: packDirectory,
          category: lower
        });
      }
      continue;
    }

    // Legacy flat layout remains readable so existing user folders do not break.
    if (!packExists(directory)) continue;
    const key = path.resolve(directory).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    addons.push({
      name: entry.name,
      directory,
      category: "legacy"
    });
  }
}

export function listSoundAddons(soundRoots) {
  const addons = [];
  const seen = new Set();

  for (const soundRoot of soundRoots) {
    discoverRoot(soundRoot, addons, seen);
  }

  return addons.sort((a, b) =>
    a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
}
