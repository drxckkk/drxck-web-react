import { PROJECTS } from "./projects";

/* ---------------------------------------------------------------------------
 * Games are a curated view over PROJECTS — the entries that are playable
 * products rather than systems built for other developers.
 *
 * ADDING A GAME
 *   1. Make sure it exists in projects.js.
 *   2. Add its id below, with an optional `route` if it gets its own page.
 *
 * Ids that no longer exist in projects.js are skipped rather than throwing, so
 * editing projects.js can never blank out /games.
 * ------------------------------------------------------------------------- */

const ENTRIES = [
  { id: "luckyblock", route: "/catchaluckyblock", status: "Shipped" },
  { id: "kitchensim", status: "Shipped" },
  { id: "jumpugc", status: "Prototype" },
];

export const GAMES = ENTRIES.map((entry) => {
  const project = PROJECTS.find((p) => p.id === entry.id);
  return project ? { ...project, ...entry } : null;
}).filter(Boolean);

export const gameById = (id) => GAMES.find((game) => game.id === id);
