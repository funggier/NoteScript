import fs from "node:fs";
import path from "node:path";
import { NoteScriptError } from "../error.js";

export function networkConfigFile(programRoot) {
  return path.join(programRoot, "config", "network.json");
}

export function resolveProgramRoot(startDir, explicitRoot = "") {
  if (explicitRoot) return path.resolve(explicitRoot);

  let current = path.resolve(startDir);
  for (let depth = 0; depth < 8; depth += 1) {
    if (fs.existsSync(networkConfigFile(current))) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  throw new NoteScriptError(
    "Unable to locate config/network.json from: " + startDir
  );
}

export function loadNetworkConfig(programRoot) {
  const file = networkConfigFile(programRoot);
  if (!fs.existsSync(file)) {
    throw new NoteScriptError(
      "Missing network configuration file: " + file
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new NoteScriptError(
      "Invalid network configuration JSON: " + file + " (" + error.message + ")"
    );
  }

  const host = String(parsed.host ?? "").trim();
  const port = Number(parsed.port);

  if (!host) {
    throw new NoteScriptError("Network configuration requires a non-empty host.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new NoteScriptError("Network configuration port must be an integer from 1 to 65535.");
  }

  return { host, port, file };
}

export function studioUrl(config) {
  let host = config.host;
  if (host === "0.0.0.0") host = "127.0.0.1";
  if (host === "::") host = "::1";
  if (host.includes(":") && !host.startsWith("[")) host = "[" + host + "]";
  return "http://" + host + ":" + config.port + "/";
}
