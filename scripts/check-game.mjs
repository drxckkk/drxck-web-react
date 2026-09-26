// Guards the deploy. public/fnajk-app is gitignored, so a clean checkout would
// otherwise publish a site whose /fnajk page loads an iframe that 404s.
import { existsSync, readFileSync } from "node:fs";

const fail = (msg) => {
  console.error(msg + "\nRun: npm run sync:game");
  process.exit(1);
};

if (!existsSync("public/fnajk-app/index.html")) {
  fail(
    "public/fnajk-app is missing - deploying now would remove the game from " +
      "the live site.",
  );
}

// The game content ships as gamedata-N.bin parts listed in gamedata.json. A
// half-synced copy still has index.html, but the game would fail to boot with
// "Failed to load game data", so check every part is actually here.
if (!existsSync("public/fnajk-app/gamedata.json")) {
  fail("public/fnajk-app/gamedata.json is missing - the game has no content.");
}

const manifest = JSON.parse(readFileSync("public/fnajk-app/gamedata.json"));
const missing = manifest.parts
  .map((p) => p.name)
  .filter((name) => !existsSync(`public/fnajk-app/${name}`));

if (missing.length) {
  fail(`Game data parts missing: ${missing.join(", ")}`);
}
