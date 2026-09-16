// Copies the browser build of the game into public/ so a deploy includes it.
// The build itself lives in the FNAF-Studio repo; this only moves the output.
import { cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SOURCES = [
  process.env.FNAJK_BUILD,
  "../FNAF-Studio/web/bin/Release/net10.0/browser-wasm/AppBundle",
  "../../FNAF-Studio/web/bin/Release/net10.0/browser-wasm/AppBundle",
].filter(Boolean);

const dest = path.resolve("public/fnajk-app");
const src = SOURCES.map((p) => path.resolve(p)).find((p) =>
  existsSync(path.join(p, "index.html")),
);

if (!src) {
  console.error(
    "Could not find the game build. Build it first:\n" +
      "  dotnet build <FNAF-Studio>/web/RuntimeWeb.csproj -c Release\n" +
      "then re-run, or set FNAJK_BUILD to the AppBundle path.",
  );
  process.exit(1);
}

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });
console.log(`Synced game build\n  from ${src}\n  to   ${dest}`);
