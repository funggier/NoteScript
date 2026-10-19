#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadNetworkConfig, resolveProgramRoot, studioUrl } from "./network-config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const programRoot = resolveProgramRoot(here, process.env.NOTESCRIPT_ROOT || "");

const config = loadNetworkConfig(programRoot);
const command = process.argv[2] || "url";

if (command === "url") {
  console.log(studioUrl(config));
} else if (command === "host") {
  console.log(config.host);
} else if (command === "port") {
  console.log(String(config.port));
} else {
  console.error("Usage: network-cli.js [url|host|port]");
  process.exitCode = 2;
}
