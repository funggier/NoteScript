import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function choosePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

test("Studio serves the sustain voice-registry module to the browser", async (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "notescript-studio-http-"));
  const port = await choosePort();
  fs.mkdirSync(path.join(temp, "config"), { recursive: true });
  fs.writeFileSync(
    path.join(temp, "config", "network.json"),
    JSON.stringify({ host: "127.0.0.1", port })
  );
  const child = spawn(process.execPath, [path.join(root, "src", "control", "server.js")], {
    cwd: root,
    env: { ...process.env, NOTESCRIPT_ROOT: temp },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });
  let diagnostic = "";
  child.stderr.on("data", (chunk) => { diagnostic += String(chunk); });
  child.stdout.on("data", (chunk) => { diagnostic += String(chunk); });
  t.after(async () => {
    if (child.exitCode === null) child.kill();
    fs.rmSync(temp, { recursive: true, force: true });
  });

  const base = "http://127.0.0.1:" + port;
  let response;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      response = await fetch(base + "/ui/piano-voices.js", {
        signal: AbortSignal.timeout(1000)
      });
      break;
    } catch {
      if (child.exitCode !== null) break;
      await sleep(75);
    }
  }
  assert.ok(response, "Studio must start: " + diagnostic);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/javascript/);
  assert.match(await response.text(), /export class PianoVoiceRegistry/);

  const app = await fetch(base + "/ui/app.js");
  assert.equal(app.status, 200);
  assert.match(await app.text(), /from "\.\/piano-voices\.js"/);

  const keyboard = await fetch(base + "/ui/keyboard.js");
  assert.equal(keyboard.status, 200);
  assert.match(await keyboard.text(), /physicalBindingFromCode/);
});
