import kartVideo from "../assets/project4.mp4";
import orbVideo from "../assets/project2.mp4";
import kitchenVideo from "../assets/project3.mp4";
import kitchenSimVideo from "../assets/project5.mp4";
import realVehVideo from "../assets/project6.mp4";
import luckyVideo from "../assets/project1.mp4";

/* ---------------------------------------------------------------------------
 * ADDING A NEW PLATFORM
 *
 * 1. Add an entry to PLATFORMS below (Unity and Apps are already stubbed).
 * 2. Drop its projects into PROJECTS with `platform: "<that id>"`.
 *
 * That's it. The filter bar, counts, empty states and "in progress" chips all
 * derive from this file — no component needs to change.
 *
 * A platform with zero projects renders as a dimmed "soon" chip automatically,
 * so you can announce a platform before the work is public.
 * ------------------------------------------------------------------------- */

export const PLATFORMS = [
  {
    id: "roblox",
    label: "Roblox",
    icon: "fa-solid fa-cube",
    blurb: "Gameplay systems, full builds and tooling in Luau.",
  },
  {
    id: "Others",
    label: "Others",
    icon: "fa-solid fa-layer-group",
    blurb: "C++, physics and voxel engines",
  },
];

export const PROJECTS = [
  {
    id: "luckyblock",
    platform: "roblox",
    title: "Catch a Lucky Block",
    year: "2026",
    summary:
      "Project built and shipped, where the gameplay is focused mainly on players breaking Lucky Blocks to get rewards and items. The project was built with a focus on modularity and reusability, heavily optimized and entirely coded by myself.",
    overview:
      "Project is built focused on optimization, modularity and being high quality. The UI is made to be satisfying and attractive to those players that end up playing front-page games. The game was planned to be satisfying, attractive and fun.",
    stats: [
      { label: "Delivery", value: "7 days" },
      { label: "From", value: "$500" },
    ],
    video: luckyVideo,
    featured: true,
  }, {
    id: "kartsystem",
    platform: "roblox",
    title: "Kart System",
    year: "2026",
    summary:
      "A kart vehicle system with a smooth driving, good handling and funny suspension inspired by popular kart games people already know how to play.",
    overview:
      "Built on a lightweight raycast suspension with body forces driving the physics, so handling stays smooth at any speed. Tuned to hold frame rate on low-end devices, and every curve is exposed as a config value so a designer can re-feel the whole kart without touching code.",
    stats: [
      { label: "Delivery", value: "5 days" },
      { label: "From", value: "$200" },
    ],
    video: kartVideo,
    featured: true,
  },
  {
    id: "kitchensim",
    platform: "roblox",
    title: "Kitchen Simulator",
    year: "2026",
    summary:
      "A complete, shipped simulator game, designed, programmed and balanced end to end. Configurable, optimized and satisfying.",
    overview:
      "Placement system, unlockable areas, shops, a full cooking loop, collectables and progression. Built for production, with the data layer and economy structured so new content drops in without a rewrite.",
    stats: [
      { label: "Delivery", value: "3 weeks" },
      { label: "From", value: "$600" },
    ],
    video: kitchenSimVideo,
    featured: true,
  },
  {
    id: "orbsystem",
    platform: "roblox",
    title: "Orb System",
    year: "2025",
    summary:
      "Custom physics and object pooling with cluster, optimized and no matter how many orbs are on screen it will perform well.",
    overview:
      "Orbs are pooled and reused instead of being created and destroyed each spawn, and the motion runs on hand-rolled physics rather than the engine's. The result holds a stable frame rate with 512+ orbs live at once.",
    stats: [
      { label: "Delivery", value: "2 days" },
      { label: "From", value: "$70" },
    ],
    video: orbVideo,
  },
  {
    id: "realveh",
    platform: "roblox",
    title: "Realistic Vehicle System",
    year: "2026",
    summary:
      "Realistic vehicle system with Raycast suspension, configurable handling model. Simulating realistic suspension, springs, air resistance and more. Also built to be modular and reusable.",
    overview:
      "Raycast, bodyforces, custom physics and sounds, all combined simulating realistic vehicle behavior within Roblox.",
    stats: [
      { label: "Delivery", value: "4 days" },
      { label: "From", value: "$400" },
    ],
    video: realVehVideo,
  }, {
    id: "jumpugc",
    platform: "roblox",
    title: "Jump for UGC",
    year: "2025",
    summary:
      "Basic 'Jump for UGC' game where players jump and complete obbies to earn gold and unlock free UGC items.",
    overview:
      "This project was built entirely focused on being modular and easily customizaly, using Roact, Nevermore Engine and was a side project mainly as a proof of concept.",
    stats: [
      { label: "Delivery", value: "3 days" },
      { label: "From", value: "$100" },
    ],
    video: kitchenVideo,
  },
];

/** Platforms that currently have shipped work, in PLATFORMS order. */
export const countFor = (platformId) =>
  PROJECTS.filter((p) => p.platform === platformId).length;

export const platformById = (id) => PLATFORMS.find((p) => p.id === id);
