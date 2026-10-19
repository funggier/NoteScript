import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.join(root, "out", "NoteScript-portable");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyDir(source, target, filter = () => true) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const dst = path.join(target, entry.name);
    if (!filter(src, entry)) continue;
    if (entry.isDirectory()) copyDir(src, dst, filter);
    else fs.copyFileSync(src, dst);
  }
}

copyDir(path.join(root, "src"), path.join(out, "app", "src"));
fs.copyFileSync(path.join(root, "package.json"), path.join(out, "app", "package.json"));
fs.copyFileSync(path.join(root, "LICENSE"), path.join(out, "LICENSE"));
fs.copyFileSync(path.join(root, "README.md"), path.join(out, "README.md"));

const runtimeDir = path.join(out, "runtime");
fs.mkdirSync(runtimeDir, { recursive: true });
const runtimeName = process.platform === "win32" ? "node.exe" : "node";
fs.copyFileSync(process.execPath, path.join(runtimeDir, runtimeName));

for (const dir of ["sounds", "projects", "exports", "config", "templates"]) {
  fs.mkdirSync(path.join(out, dir), { recursive: true });
}
for (const format of ["SFZ", "SF2", "SF3"]) {
  fs.mkdirSync(path.join(out, "instruments", format), { recursive: true });
}

copyDir(path.join(root, "examples", "sounds"), path.join(out, "sounds"));
copyDir(path.join(root, "templates"), path.join(out, "templates"));
fs.copyFileSync(path.join(root, "examples", "evening-walk.md"), path.join(out, "projects", "Evening Walk.md"));

const cmd = [
  "@echo off",
  "setlocal",
  "set ROOT=%~dp0",
  "set NOTESCRIPT_ROOT=%ROOT%",
  '"%ROOT%runtime\\node.exe" "%ROOT%app\\src\\cli.js" %*'
].join("\r\n") + "\r\n";
fs.writeFileSync(path.join(out, "NoteScript.cmd"), cmd);

const preview = [
  "@echo off",
  "setlocal",
  "set ROOT=%~dp0",
  "set NOTESCRIPT_ROOT=%ROOT%",
  'if "%~1"=="" (',
  '  echo Drag a .md song onto this file or pass a song path.',
  "  exit /b 2",
  ")",
  '"%ROOT%runtime\\node.exe" "%ROOT%app\\src\\cli.js" preview "%~1"'
].join("\r\n") + "\r\n";
fs.writeFileSync(path.join(out, "Preview-Song.cmd"), preview);

const render = [
  "@echo off",
  "setlocal",
  "set ROOT=%~dp0",
  "set NOTESCRIPT_ROOT=%ROOT%",
  'if "%~1"=="" (',
  '  echo Drag a .md song onto this file or pass a song path.',
  "  exit /b 2",
  ")",
  'for %%F in ("%~1") do set NAME=%%~nF',
  '"%ROOT%runtime\\node.exe" "%ROOT%app\\src\\cli.js" render "%~1" -o "%ROOT%exports\\%NAME%.wav"'
].join("\r\n") + "\r\n";
fs.writeFileSync(path.join(out, "Render-Song.cmd"), render);

const control = [
  "@echo off",
  "setlocal",
  "set ROOT=%~dp0",
  "set NOTESCRIPT_ROOT=%ROOT%",
  '"%ROOT%runtime\\node.exe" "%ROOT%app\\src\\control\\server.js"'
].join("\r\n") + "\r\n";
fs.writeFileSync(path.join(out, "Start-Control-API.cmd"), control);

console.log("Portable folder created: " + out);
