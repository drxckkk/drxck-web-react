// Guards the deploy. public/fnajk-app is gitignored, so a clean checkout would
// otherwise publish a site whose /fnajk page loads an iframe that 404s.
import { existsSync } from "node:fs";

if (!existsSync("public/fnajk-app/index.html")) {
  console.error(
    "public/fnajk-app is missing - deploying now would remove the game from " +
      "the live site.\nRun: npm run sync:game",
  );
  process.exit(1);
}
