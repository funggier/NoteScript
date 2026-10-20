#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createControlService } from "./service.js";
import { loadNetworkConfig, resolveProgramRoot } from "./network-config.js";
import { NoteScriptError } from "../error.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.join(here, "ui");
const programRoot = resolveProgramRoot(here, process.env.NOTESCRIPT_ROOT || "");
const network = loadNetworkConfig(programRoot);
const host = network.host;
const port = network.port;
const token = process.env.NOTESCRIPT_CONTROL_TOKEN || "";
const service = createControlService(programRoot);

function json(res, status, body) {
  const payload = Buffer.from(JSON.stringify(body, null, 2));
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": payload.length,
    "cache-control": "no-store"
  });
  res.end(payload);
}

function binary(res, status, contentType, payload) {
  res.writeHead(status, {
    "content-type": contentType,
    "content-length": payload.length,
    "cache-control": "no-store"
  });
  res.end(payload);
}

function staticFile(res, file, contentType) {
  if (!fs.existsSync(file)) return json(res, 404, { ok: false, error: "not_found" });
  return binary(res, 200, contentType, fs.readFileSync(file));
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
    const url = new URL(req.url || "/", "http://127.0.0.1");

    if (req.method === "GET" && url.pathname === "/") {
      return staticFile(res, path.join(uiRoot, "index.html"), "text/html; charset=utf-8");
    }
    if (req.method === "GET" && url.pathname === "/ui/app.js") {
      return staticFile(res, path.join(uiRoot, "app.js"), "text/javascript; charset=utf-8");
    }
    if (req.method === "GET" && url.pathname === "/ui/keyboard.js") {
      return staticFile(res, path.join(uiRoot, "keyboard.js"), "text/javascript; charset=utf-8");
    }
    if (req.method === "GET" && url.pathname === "/ui/style.css") {
      return staticFile(res, path.join(uiRoot, "style.css"), "text/css; charset=utf-8");
    }

    if (!authorized(req)) return json(res, 401, { ok: false, error: "unauthorized" });

    if (req.method === "GET" && url.pathname === "/v1/health") {
      return json(res, 200, service.health());
    }
    if (req.method === "GET" && url.pathname === "/v1/capabilities") {
      return json(res, 200, service.capabilities());
    }
    if (req.method === "GET" && url.pathname === "/v1/projects") {
      return json(res, 200, { projects: service.listProjects() });
    }
    if (req.method === "GET" && url.pathname === "/v1/project") {
      return json(res, 200, service.getProject(url.searchParams.get("project")));
    }
    if (req.method === "GET" && url.pathname === "/v1/studio/settings") {
      return json(res, 200, service.getStudioSettings());
    }
    if (req.method === "GET" && url.pathname === "/v1/sounds") {
      const details = url.searchParams.get("details") === "1";
      return json(res, 200, {
        sounds: details
          ? service.listPortableSoundsDetailed()
          : service.listSounds(url.searchParams.get("project"))
      });
    }
    if (req.method === "GET" && url.pathname === "/v1/sound") {
      return json(res, 200, service.getSoundDetails(url.searchParams.get("id")));
    }
    if (req.method === "GET" && url.pathname === "/v1/instruments") {
      return json(res, 200, { instruments: service.listInstruments(url.searchParams.get("project")) });
    }
    if (req.method === "GET" && url.pathname === "/v1/live/status") {
      return json(res, 200, service.liveStatus());
    }
    if (req.method === "GET" && url.pathname === "/v1/game/beatlane6/chart") {
      return json(
        res,
        200,
        service.getBeatLane6Chart(
          url.searchParams.get("project"),
          url.searchParams.get("difficulty") || "normal"
        )
      );
    }
    if (req.method === "GET" && url.pathname === "/v1/transport/audio") {
      const sourceType = url.searchParams.get("sourceType");
      const sourceId = url.searchParams.get("sourceId");
      const preview = service.getTransportPreview(
        url.searchParams.get("project"),
        sourceType && sourceId ? { type: sourceType, id: sourceId } : null
      );
      return binary(res, 200, "audio/wav", preview.buffer);
    }
    if (req.method === "GET" && url.pathname === "/v1/transport/track-audio") {
      const preview = service.getTransportTrackPreview(
        url.searchParams.get("project"),
        url.searchParams.get("track")
      );
      return binary(res, 200, "audio/wav", preview.buffer);
    }
    if (req.method === "POST" && url.pathname === "/v1/tracks/track-audio") {
      const input = await body(req);
      const preview = service.getMarkdownTrackPreview(
        input.markdown,
        input.track,
        input.fileName || "Tracks Workspace.md"
      );
      return binary(res, 200, "audio/wav", preview.buffer);
    }
    if (req.method === "POST" && url.pathname === "/v1/tracks/mix-audio") {
      const input = await body(req);
      const mix = service.getMarkdownMixAudio(
        input.markdown,
        input.fileName || "Tracks Mix.md",
        input.mutedTracks || []
      );
      return binary(res, 200, "audio/wav", mix.buffer);
    }
    if (req.method === "POST" && url.pathname === "/v1/tracks/set-zip") {
      const input = await body(req);
      const archive = service.getMarkdownTrackSetZip(
        input.markdown,
        input.fileName || "Tracks Workspace.md",
        input.mutedTracks || []
      );
      return binary(res, 200, "application/zip", archive.buffer);
    }
    if (req.method === "GET" && url.pathname === "/v1/audition/audio") {
      const pack = url.searchParams.get("pack");
      const note = url.searchParams.has("note") ? url.searchParams.get("note") : null;
      const trigger = url.searchParams.get("trigger");
      const audio = service.getAuditionAudio(pack, { note, trigger });
      return binary(res, 200, "audio/wav", audio.buffer);
    }
    if (req.method === "GET" && url.pathname === "/v1/audition/instrument") {
      const instrument = url.searchParams.get("instrument");
      const note = url.searchParams.get("note");
      const velocity = url.searchParams.get("velocity") || "96";
      const audio = service.getInstrumentAuditionAudio(instrument, note, velocity);
      return binary(res, 200, "audio/wav", audio.buffer);
    }

    if (req.method === "POST" && url.pathname === "/v1/transport/cache/clear") {
      const input = await body(req);
      return json(res, 200, service.clearTransportCache(input.project || null));
    }

    if (req.method === "POST" && url.pathname === "/v1/live/select") {
      const input = await body(req);
      return json(res, 200, await service.liveSelectInstrument(input.instrument));
    }
    if (req.method === "POST" && url.pathname === "/v1/live/note-on") {
      const input = await body(req);
      return json(res, 200, service.liveNoteOn(input.note, input.velocity));
    }
    if (req.method === "POST" && url.pathname === "/v1/live/note-off") {
      const input = await body(req);
      return json(res, 200, service.liveNoteOff(input.note));
    }
    if (req.method === "POST" && url.pathname === "/v1/live/sustain") {
      const input = await body(req);
      return json(res, 200, service.liveSustain(input.enabled));
    }
    if (req.method === "POST" && url.pathname === "/v1/live/all-notes-off") {
      return json(res, 200, service.liveAllNotesOff());
    }
    if (req.method === "POST" && url.pathname === "/v1/live/stop") {
      return json(res, 200, await service.liveStop());
    }

    if (req.method === "POST" && url.pathname === "/v1/projects") {
      const input = await body(req);
      return json(res, 200, service.saveProject(input.name, input.markdown));
    }
    if (req.method === "POST" && url.pathname === "/v1/projects/rename") {
      const input = await body(req);
      return json(res, 200, service.renameProject(input.project, input.name));
    }
    if (req.method === "POST" && url.pathname === "/v1/projects/delete") {
      const input = await body(req);
      return json(res, 200, service.deleteProject(input.project));
    }
    if (req.method === "POST" && url.pathname === "/v1/analyze") {
      const input = await body(req);
      return json(res, 200, service.analyzeMarkdown(input.markdown));
    }
    if (req.method === "POST" && url.pathname === "/v1/studio/settings") {
      const input = await body(req);
      return json(res, 200, service.saveStudioSettings(input));
    }
    if (req.method === "POST" && url.pathname === "/v1/validate") {
      const input = await body(req);
      return json(res, 200, service.validateProject(input.project));
    }
    if (req.method === "POST" && url.pathname === "/v1/render/audio") {
      const input = await body(req);
      const rendered = service.getMarkdownRenderAudio(
        input.markdown,
        input.fileName || input.project || "Studio Render.md"
      );
      return binary(res, 200, "audio/wav", rendered.buffer);
    }
    if (req.method === "GET" && url.pathname === "/v1/render/audio") {
      const sourceType = url.searchParams.get("sourceType");
      const sourceId = url.searchParams.get("sourceId");
      const rendered = service.getProjectRenderAudio(
        url.searchParams.get("project"),
        sourceType && sourceId ? { type: sourceType, id: sourceId } : null
      );
      return binary(res, 200, "audio/wav", rendered.buffer);
    }
    if (req.method === "POST" && url.pathname === "/v1/render") {
      const input = await body(req);
      const sourceOverride =
        input.sourceType && input.sourceId
          ? { type: input.sourceType, id: input.sourceId }
          : null;
      return json(
        res,
        200,
        service.renderProject(input.project, input.output, sourceOverride)
      );
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

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error("NoteScript Control API port is already in use: " + host + ":" + port);
    process.exitCode = 2;
    return;
  }
  throw error;
});

let shuttingDown = false;

async function shutdown(signal = "shutdown") {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log("NoteScript Control API stopping: " + signal);
  try {
    await service.shutdown();
  } catch (error) {
    console.error("Playback shutdown error:", error.message || String(error));
  }

  await new Promise((resolve) => {
    if (!server.listening) return resolve();
    server.close(() => resolve());
    setTimeout(resolve, 500);
  });
}

process.on("SIGINT", async () => {
  await shutdown("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await shutdown("SIGTERM");
  process.exit(0);
});

server.listen(port, host, () => {
  console.log("NoteScript Control API listening on http://" + host + ":" + port);
  console.log("NoteScript Studio: http://" + host + ":" + port + "/");
  console.log("Portable root: " + programRoot);
  console.log("Network config: " + network.file);
  if (!token) console.log("Control token: disabled (loopback-only default recommended).");
});
