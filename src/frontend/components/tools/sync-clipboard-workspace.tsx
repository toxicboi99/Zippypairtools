"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Clipboard, Copy, Link2, Loader2, Radio, Unplug } from "lucide-react";
import { io, type Socket } from "socket.io-client";

import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";

interface RoomResult {
  ok: boolean;
  roomCode?: string;
  clipboard?: string;
  error?: string;
}

export function SyncClipboardWorkspace() {
  const socketRef = useRef<Socket | null>(null);
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [roomInput, setRoomInput] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [clipboard, setClipboard] = useState("");
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => () => {
    if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    socketRef.current?.disconnect();
  }, []);

  function getSocket() {
    if (socketRef.current) return socketRef.current;

    setStatus("connecting");
    const socket = io({ path: "/api/socket.io", transports: ["websocket", "polling"] });
    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", () => {
      setStatus("disconnected");
      setError("Could not reach the clipboard sync service.");
    });
    socket.on("clipboard:updated", (value: string) => setClipboard(value));
    socketRef.current = socket;
    return socket;
  }

  function createRoom() {
    setError("");
    getSocket().emit("room:create", (result: RoomResult) => {
      if (!result.ok || !result.roomCode) return setError(result.error ?? "Could not create a room.");
      setRoomCode(result.roomCode);
      setRoomInput(result.roomCode);
      setClipboard(result.clipboard ?? "");
    });
  }

  function joinRoom() {
    const normalized = roomInput.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(normalized)) {
      setError("Enter a valid 6-character room code.");
      return;
    }

    setError("");
    getSocket().emit("room:join", normalized, (result: RoomResult) => {
      if (!result.ok || !result.roomCode) return setError(result.error ?? "Could not join that room.");
      setRoomCode(result.roomCode);
      setClipboard(result.clipboard ?? "");
    });
  }

  function updateClipboard(value: string) {
    setClipboard(value);
    if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    updateTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("clipboard:update", value, (result: RoomResult) => {
        if (!result.ok) setError(result.error ?? "Clipboard update failed.");
      });
    }, 180);
  }

  async function copyRoomCode() {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function leaveRoom() {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setRoomCode("");
    setClipboard("");
    setStatus("disconnected");
  }

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-semibold text-foreground">Sync clipboard</h2><p className="mt-2 text-sm text-muted-foreground">Temporary rooms close automatically after everyone leaves.</p></div>
          <span className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm" aria-live="polite">
            {status === "connecting" ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : status === "connected" ? <Radio aria-hidden="true" className="size-4 text-chart-2" /> : <Unplug aria-hidden="true" className="size-4 text-muted-foreground" />}
            {status}
          </span>
        </div>

        {!roomCode ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-5"><h3 className="font-semibold">Start a new room</h3><p className="mt-2 text-sm text-muted-foreground">Create a code, then enter it on another device.</p><Button type="button" className="mt-5" onClick={createRoom}><Link2 aria-hidden="true" />Create room</Button></div>
            <div className="rounded-lg border bg-background p-5"><label htmlFor="room-code" className="font-semibold">Join a room</label><Input id="room-code" className="mt-4 uppercase" value={roomInput} maxLength={6} autoComplete="off" placeholder="ABC123" onChange={(event) => setRoomInput(event.target.value.replace(/[^a-z0-9]/gi, ""))} /><Button type="button" variant="outline" className="mt-3" onClick={joinRoom}>Join room</Button></div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-background p-4"><span className="text-sm text-muted-foreground">Room</span><code className="text-lg font-semibold tracking-normal">{roomCode}</code><Button type="button" variant="ghost" size="icon" aria-label="Copy room code" onClick={copyRoomCode}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button><Button type="button" variant="outline" className="ml-auto" onClick={leaveRoom}>Leave room</Button></div>
            <label htmlFor="shared-clipboard" className="mt-5 block text-sm font-medium">Shared clipboard text</label>
            <textarea id="shared-clipboard" value={clipboard} maxLength={100000} onChange={(event) => updateClipboard(event.target.value)} placeholder="Type or paste text here..." className="mt-2 min-h-64 w-full resize-y rounded-md border border-input bg-background p-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
            <div className="mt-3 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => navigator.clipboard.writeText(clipboard)}><Clipboard aria-hidden="true" />Copy text</Button><Button type="button" variant="outline" onClick={async () => updateClipboard(await navigator.clipboard.readText())}>Paste from device</Button></div>
          </div>
        )}

        {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
