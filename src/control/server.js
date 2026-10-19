#!/usr/bin/env node
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createControlService } from "./service.js";
import { NoteScriptError } from "../error.js";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const programRoot = process.env.NOTESCRIPT_ROOT ? path.resolve(process.env.NOTESCRIPT_ROOT) : sourceRoot;
const host = process.env.NOTESCRIPT_CONTROL_HOST || "127.0.0.1";
const port = Number.parseInt(process.env.NOTESCRIPT_CONTROL_PORT || "19427", 10);
const token = process.env.NOTESCRIPT_CONTROL_TOKEN || "";
const service = createControlService(programRoot);

function json(res, status, body) {
  const payload = Buffer.from(JSON.stringify(body, null, 2));
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": payload.length
  });
  res.end(payload);
}

async function body(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 2 * 1024 * 1024) throw new NoteScriptError("Request body is too large.");
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function authorized(req) {
  if (!token) return true;
  return req.headers.authorization === "Bearer " + token;
}

const server = http.createServer(async (req, res) => {
  try {
    if (!authorized(req)) return json(res, 401, { ok: false, error: "unauthorized" });

    const url = new URL(req.url || "/", "http://127.0.0.1");

    if (req.method === "GET" && url.pathname === "/v1/health") {
      return json(res, 200, service.health());
    }
    if (req.method === "GET" && url.pathname === "/v1/projects") {
      return json(res, 200, { projects: service.listProjects() });
    }
    if (req.method === "GET" && url.pathname === "/v1/sounds") {
      return json(res, 200, { sounds: service.listSounds(url.searchParams.get("project")) });
    }
    if (req.method === "GET" && url.pathname === "/v1/instruments") {
      return json(res, 200, { instruments: service.listInstruments(url.searchParams.get("project")) });
    }

    if (req.method === "POST" && url.pathname === "/v1/projects") {
      const input = await body(req);
      return json(res, 200, service.saveProject(input.name, input.markdown));
    }
    if (req.method === "POST" && url.pathname === "/v1/validate") {
      const input = await body(req);
      return json(res, 200, service.validateProject(input.project));
    }
    if (req.method === "POST" && url.pathname === "/v1/render") {
      const input = await body(req);
      return json(res, 200, service.renderProject(input.project, input.output));
    }
    if (req.method === "POST" && url.pathname === "/v1/midi") {
      const input = await body(req);
      return json(res, 200, service.exportMidi(input.project, input.output));
    }

    return json(res, 404, { ok: false, error: "not_found" });
  } catch (error) {
    const status = error instanceof NoteScriptError ? 400 : 500;
    return json(res, status, {
      ok: false,
      error: error.name || "Error",
      message: error.message || String(error)
    });
  }
});

server.listen(port, host, () => {
  console.log("NoteScript Control API listening on http://" + host + ":" + port);
  console.log("Portable root: " + programRoot);
  if (!token) console.log("Control token: disabled (loopback-only default recommended).");
});
