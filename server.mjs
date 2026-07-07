/* global Buffer, clearTimeout, console, process, setInterval, setTimeout */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { parse } from "node:url";

import next from "next";
import { Server } from "socket.io";

const dev = process.argv.includes("--dev");
const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const EMPTY_ROOM_TTL_MS = 5 * 60 * 1000;
const MAX_CLIPBOARD_BYTES = 100_000;
const UPDATE_WINDOW_MS = 10_000;
const MAX_UPDATES_PER_WINDOW = 40;
const rooms = new Map();

function createRoomCode() {
  let code;
  do code = randomBytes(5).toString("base64url").replace(/[-_]/g, "").slice(0, 6).toUpperCase();
  while (code.length !== 6 || rooms.has(code));
  return code;
}

function publicRoom(roomCode) {
  const room = rooms.get(roomCode);
  return room ? { ok: true, roomCode, clipboard: room.clipboard } : { ok: false, error: "Room not found or expired." };
}

await app.prepare();

const httpServer = createServer((request, response) => {
  handle(request, response, parse(request.url ?? "/", true));
});

const io = new Server(httpServer, {
  path: "/api/socket.io",
  maxHttpBufferSize: 128 * 1024,
  serveClient: false,
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  socket.data.updateWindow = { startedAt: Date.now(), count: 0 };

  socket.on("room:create", (ack) => {
    if (typeof ack !== "function") return;
    const roomCode = createRoomCode();
    rooms.set(roomCode, { clipboard: "", createdAt: Date.now(), emptyTimer: null });
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    ack(publicRoom(roomCode));
  });

  socket.on("room:join", (value, ack) => {
    if (typeof ack !== "function") return;
    const roomCode = typeof value === "string" ? value.trim().toUpperCase() : "";
    const room = rooms.get(roomCode);
    if (!room || !/^[A-Z0-9]{6}$/.test(roomCode)) return ack({ ok: false, error: "Room not found or expired." });
    if (room.emptyTimer) clearTimeout(room.emptyTimer);
    room.emptyTimer = null;
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    ack(publicRoom(roomCode));
  });

  socket.on("clipboard:update", (value, ack) => {
    if (typeof ack !== "function") return;
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return ack({ ok: false, error: "Join a room before syncing text." });
    if (typeof value !== "string" || Buffer.byteLength(value, "utf8") > MAX_CLIPBOARD_BYTES) return ack({ ok: false, error: "Clipboard text must be 100 KB or smaller." });

    const now = Date.now();
    const window = socket.data.updateWindow;
    if (now - window.startedAt > UPDATE_WINDOW_MS) socket.data.updateWindow = { startedAt: now, count: 0 };
    socket.data.updateWindow.count += 1;
    if (socket.data.updateWindow.count > MAX_UPDATES_PER_WINDOW) return ack({ ok: false, error: "Updates are too frequent. Pause briefly and try again." });

    room.clipboard = value;
    socket.to(roomCode).emit("clipboard:updated", value);
    ack({ ok: true, roomCode });
  });

  socket.on("disconnect", () => {
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;
    setTimeout(() => {
      if ((io.sockets.adapter.rooms.get(roomCode)?.size ?? 0) > 0) return;
      room.emptyTimer = setTimeout(() => rooms.delete(roomCode), EMPTY_ROOM_TTL_MS);
    }, 0);
  });
});

setInterval(() => {
  const cutoff = Date.now() - ROOM_TTL_MS;
  for (const [roomCode, room] of rooms) if (room.createdAt < cutoff) rooms.delete(roomCode);
}, 60_000).unref();

httpServer.listen(port, hostname, () => {
  console.log(`ZippyPair Tools ready on http://${hostname}:${port}`);
});
