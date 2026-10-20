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

for (const dir of ["sounds", "projects", "exports", "config", "templates", "tools"]) {
  fs.mkdirSync(path.join(out, dir), { recursive: true });
}

fs.copyFileSync(
  path.join(root, "config", "network.json"),
  path.join(out, "config", "network.json")
);

for (const format of ["SFZ", "SF2", "SF3"]) {
  fs.mkdirSync(path.join(out, "instruments", format), { recursive: true });
}

copyDir(path.join(root, "examples", "sounds"), path.join(out, "sounds"));
copyDir(path.join(root, "examples", "instruments"), path.join(out, "instruments"));
copyDir(path.join(root, "templates"), path.join(out, "templates"));
if (fs.existsSync(path.join(root, "tools"))) {
  copyDir(path.join(root, "tools"), path.join(out, "tools"));
}

fs.copyFileSync(
  path.join(root, "examples", "sfz-basic.md"),
  path.join(out, "projects", "SFZ Basic.md")
);
fs.copyFileSync(
  path.join(root, "examples", "beatlane6-starter.md"),
  path.join(out, "projects", "BeatLane6 Starter.md")
);

for (const [sourceName, projectName] of [
  ["sunlit-detour.md", "Sunlit Detour.md"]
]) {
  fs.copyFileSync(
    path.join(root, "examples", "beatlane6-songs", sourceName),
    path.join(out, "projects", projectName)
  );
}

for (const [sourceName, projectName] of [
  ["morning-window.md", "Morning Window.md"],
  ["rain-on-the-balcony.md", "Rain on the Balcony.md"],
  ["slow-train-home.md", "Slow Train Home.md"],
  ["cafe-after-rain.md", "Cafe After Rain.md"],
  ["cloud-pillow.md", "Cloud Pillow.md"],
  ["river-lanterns.md", "River Lanterns.md"],
  ["sunday-pages.md", "Sunday Pages.md"],
  ["quiet-neon.md", "Quiet Neon.md"],
  ["garden-at-four.md", "Garden at Four.md"],
  ["moonlit-tea.md", "Moonlit Tea.md"]
]) {
  fs.copyFileSync(
    path.join(root, "examples", "listening-songs", sourceName),
    path.join(out, "projects", projectName)
  );
}

const cmd = [
  "@echo off",
  "setlocal",
  "set ROOT=%~dp0",
  "set NOTESCRIPT_ROOT=%ROOT%",
  "set SERVER=%ROOT%app\\src\\control\\server.js",
  "set MODE=%~1",
  "if \"%MODE%\"==\"\" goto studio",
  "if /I \"%MODE%\"==\"studio\" goto studio",
  "if /I \"%MODE%\"==\"start\" goto start",
  "if /I \"%MODE%\"==\"stop\" goto stop",
  "if /I \"%MODE%\"==\"status\" goto status",
  "goto cli",
  "",
  ":studio",
  "call :startserver",
  "if errorlevel 1 exit /b %errorlevel%",
  "call :loadurl",
  "if errorlevel 1 exit /b %errorlevel%",
  "powershell -NoProfile -Command \"Start-Sleep -Milliseconds 500\"",
  "start \"\" \"%STUDIO_URL%\"",
  "exit /b 0",
  "",
  ":start",
  "call :startserver",
  "exit /b %errorlevel%",
  "",
  ":stop",
  "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$server=$env:SERVER; $items=@(Get-CimInstance Win32_Process | Where-Object { $_.Name -ieq 'node.exe' -and $_.CommandLine -and $_.CommandLine.IndexOf($server, [StringComparison]::OrdinalIgnoreCase) -ge 0 }); if ($items.Count -eq 0) { Write-Host 'NoteScript Control API is not running.'; exit 0 }; foreach ($p in $items) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue; Write-Host ('Stopped NoteScript Control API PID ' + $p.ProcessId) }\"",
  "exit /b %errorlevel%",
  "",
  ":status",
  "call :loadurl",
  "if errorlevel 1 exit /b %errorlevel%",
  "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$server=$env:SERVER; $url=$env:STUDIO_URL; $items=@(Get-CimInstance Win32_Process | Where-Object { $_.Name -ieq 'node.exe' -and $_.CommandLine -and $_.CommandLine.IndexOf($server, [StringComparison]::OrdinalIgnoreCase) -ge 0 }); Write-Host 'NoteScript Control API'; if ($items.Count -eq 0) { Write-Host 'State : STOPPED'; Write-Host ('URL   : ' + $url); Write-Host 'Health: N/A'; exit 0 }; $pidText=($items | ForEach-Object { [string]$_.ProcessId }) -join ', '; Write-Host 'State : RUNNING'; Write-Host ('PID   : ' + $pidText); Write-Host ('URL   : ' + $url); try { $health=Invoke-RestMethod -Uri ($url.TrimEnd('/') + '/v1/health') -TimeoutSec 2; if ($health.ok) { Write-Host 'Health: OK' } else { Write-Host 'Health: UNHEALTHY' } } catch { Write-Host 'Health: UNREACHABLE' }\"",
  "exit /b %errorlevel%",
  "",
  ":cli",
  "\"%ROOT%runtime\\node.exe\" \"%ROOT%app\\src\\cli.js\" %*",
  "exit /b %errorlevel%",
  "",
  ":startserver",
  "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$root=$env:ROOT; $node=Join-Path $root 'runtime\\node.exe'; $server=$env:SERVER; $items=@(Get-CimInstance Win32_Process | Where-Object { $_.Name -ieq 'node.exe' -and $_.CommandLine -and $_.CommandLine.IndexOf($server, [StringComparison]::OrdinalIgnoreCase) -ge 0 }); if ($items.Count -gt 0) { Write-Host ('NoteScript Control API is already running. PID ' + $items[0].ProcessId); exit 0 }; $p=Start-Process -FilePath $node -ArgumentList @($server) -WorkingDirectory $root -WindowStyle Hidden -PassThru; Write-Host ('NoteScript Control API started in background. PID ' + $p.Id)\"",
  "exit /b %errorlevel%",
  "",
  ":loadurl",
  "set STUDIO_URL=",
  "set URL_FILE=%TEMP%\\notescript-url-%RANDOM%-%RANDOM%.txt",
  "\"%ROOT%runtime\\node.exe\" \"%ROOT%app\\src\\control\\network-cli.js\" url > \"%URL_FILE%\"",
  "if errorlevel 1 (",
  "  if exist \"%URL_FILE%\" del /q \"%URL_FILE%\" >nul 2>&1",
  "  echo Unable to read config\\network.json",
  "  exit /b 2",
  ")",
  "set /p STUDIO_URL=<\"%URL_FILE%\"",
  "del /q \"%URL_FILE%\" >nul 2>&1",
  "if not defined STUDIO_URL (",
  "  echo Unable to read config\\network.json",
  "  exit /b 2",
  ")",
  "exit /b 0"
].join("\r\n") + "\r\n";

fs.writeFileSync(path.join(out, "NoteScript.cmd"), cmd);

const batWrappers = {
  "Studio.bat": ["studio"],
  "Start.bat": ["start"],
  "Stop.bat": ["stop"],
  "Status.bat": ["status"],
  "Validate.bat": ["validate"],
  "Render.bat": ["render"]
};

for (const [name, prefixArgs] of Object.entries(batWrappers)) {
  const forwarded = prefixArgs.join(" ");
  const body = [
    "@echo off",
    "setlocal",
    forwarded
      ? 'call "%~dp0NoteScript.cmd" ' + forwarded + ' %*'
      : 'call "%~dp0NoteScript.cmd" %*',
    "exit /b %errorlevel%"
  ].join("\r\n") + "\r\n";
  fs.writeFileSync(path.join(out, name), body);
}

console.log("Portable folder created: " + out);
