import { io } from "socket.io-client";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function emit(socket, event, ...args) {
  return new Promise((resolve) => socket.emit(event, ...args, resolve));
}

for (const path of ["/tools/share-files", "/tools/sync-clipboard"]) {
  const response = await fetch(`${baseUrl}${path}`);
  assert(response.status === 200, `${path} returned ${response.status}`);
}

const sitemap = await fetch(`${baseUrl}/sitemap-tools.xml`).then((response) => response.text());
assert(sitemap.includes("/tools/share-files"), "Share Files is missing from the tool sitemap.");
assert(sitemap.includes("/tools/sync-clipboard"), "Sync Clipboard is missing from the tool sitemap.");

const formData = new FormData();
formData.append("files", new Blob(["ZippyPair shared file test"], { type: "text/plain" }), "test.txt");
const uploadResponse = await fetch(`${baseUrl}/api/share-files`, { method: "POST", body: formData });
const upload = await uploadResponse.json();
assert(uploadResponse.status === 201 && upload.data?.shareId, "Share upload failed.");

const { shareId, deleteToken, files } = upload.data;
const infoResponse = await fetch(`${baseUrl}/api/share-files/${shareId}`);
assert(infoResponse.status === 200, "Share info failed.");
const downloadResponse = await fetch(`${baseUrl}/api/share-files/${shareId}/${files[0].id}`);
assert(downloadResponse.status === 200 && (await downloadResponse.text()) === "ZippyPair shared file test", "Share download failed.");
assert((await fetch(`${baseUrl}/api/share-files/${shareId}/qr`)).status === 200, "Share QR failed.");

const first = io(baseUrl, { path: "/api/socket.io", transports: ["websocket"] });
const second = io(baseUrl, { path: "/api/socket.io", transports: ["websocket"] });
await Promise.all([new Promise((resolve) => first.on("connect", resolve)), new Promise((resolve) => second.on("connect", resolve))]);
const created = await emit(first, "room:create");
assert(created.ok && created.roomCode, "Clipboard room creation failed.");
const joined = await emit(second, "room:join", created.roomCode);
assert(joined.ok, "Clipboard room join failed.");
const received = new Promise((resolve) => second.once("clipboard:updated", resolve));
const updated = await emit(first, "clipboard:update", "synced text");
assert(updated.ok && await received === "synced text", "Clipboard sync failed.");
first.disconnect();
second.disconnect();

const deleteResponse = await fetch(`${baseUrl}/api/share-files/${shareId}`, { method: "DELETE", headers: { authorization: `Bearer ${deleteToken}` } });
assert(deleteResponse.status === 200, "Share deletion failed.");

console.log("Focused tools check passed.");
