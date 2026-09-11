import luckyVideo from "../assets/project1.mp4";
import orbVideo from "../assets/project2.mp4";
import jumpVideo from "../assets/project3.mp4";
import kartVideo from "../assets/project4.mp4";
import kitchenSimVideo from "../assets/project5.mp4";
import realVehVideo from "../assets/project6.mp4";
import signalVideo from "../assets/project7.mp4";

const still = (id) => ({
  src: `/images/projects/${id}-640.webp`,
  srcSet: `/images/projects/${id}-640.webp 640w, /images/projects/${id}-1280.webp 1280w`,
  large: `/images/projects/${id}-1280.webp`,
});

export const PROJECTS = [
  {
    id: "luckyblock",
    title: "Catch a Lucky Block",
    category: "Roblox game",
    platform: "Roblox",
    filters: ["games", "roblox"],
    icon: "game",
    year: "2026",
    status: "Shipped",
    shortDescription: "Break Lucky Blocks, collect what falls out. Shipped and ready.",
    summary:
      "A shipped game where players break Lucky Blocks to earn rewards and items. Built for modularity and reuse, heavily optimized and entirely coded by me.",
    overview:
      "Built with a focus on optimization, modularity and quality. The UI is made to be satisfying and attractive to the players who end up on front-page games, and the whole loop was planned to be satisfying, attractive and fun.",
    stats: [
      { label: "Delivery", value: "7 days" },
      { label: "From", value: "$500" },
    ],
    tags: ["Luau", "UI", "Rewards"],
    video: luckyVideo,
    image: still("luckyblock"),
    featured: true,
  },
  {
    id: "scangame",
    title: "1440 MHz",
    category: "Side project",
    platform: "Desktop",
    filters: ["games"],
    icon: "signal",
    year: "2026",
    status: "In progress",
    shortDescription: "A scanning game where the world only exists once you've scanned it.",
    summary:
      "A work-in-progress demo for a LIDAR-scanning and radio-frequency detection game. The world is invisible until it's revealed in points. Built for atmosphere, feel and performance, entirely coded by me.",
    overview:
      "A side project planned to be atmospheric, tense and satisfying to play. The whole view is made of dots that only exist after you scan them. You find signals, interference and fragments, and reconstruct what was, or is, there.",
    stats: [],
    tags: ["Electron", "TypeScript", "Three.js", "Vite"],
    video: signalVideo,
    image: still("scangame"),
    featured: true,
  },
  {
    id: "kartsystem",
    title: "Kart System",
    category: "Vehicle system",
    platform: "Roblox",
    filters: ["systems", "roblox"],
    icon: "vehicle",
    year: "2026",
    status: "Shipped",
    shortDescription: "Smooth, drifty kart handling with a suspension that's fun on purpose.",
    summary:
      "A kart system with smooth driving, good handling and a funny suspension, inspired by the kart games people already know how to play.",
    overview:
      "Built on a lightweight raycast suspension with body forces driving the physics, so handling stays smooth at any speed. Tuned to hold frame rate on low-end devices, and every curve is exposed as a config value so a designer can re-feel the whole kart without touching code.",
    stats: [
      { label: "Delivery", value: "5 days" },
      { label: "From", value: "$200" },
    ],
    tags: ["Luau", "Raycast suspension", "Physics"],
    video: kartVideo,
    image: still("kartsystem"),
    featured: true,
  },
  {
    id: "kitchensim",
    title: "Kitchen Simulator",
    category: "Roblox game",
    platform: "Roblox",
    filters: ["games", "roblox"],
    icon: "game",
    year: "2026",
    status: "Shipped",
    shortDescription: "A complete simulator, designed, programmed and optimized from corner to corner.",
    summary:
      "A complete, shipped simulator game, designed, programmed and balanced end to end. Configurable, optimized and satisfying.",
    overview:
      "Placement system, unlockable areas, shops, a full cooking loop, collectables and progression. Built for production, with the data layer and economy structured so new content drops in without a rewrite.",
    stats: [
      { label: "Delivery", value: "3 weeks" },
      { label: "From", value: "$600" },
    ],
    tags: ["Luau", "Placement", "Economy", "Data"],
    video: kitchenSimVideo,
    image: still("kitchensim"),
    featured: true,
  },
  {
    id: "realveh",
    title: "Realistic Vehicle System",
    category: "Vehicle system",
    platform: "Roblox",
    filters: ["systems", "roblox"],
    icon: "vehicle",
    year: "2026",
    status: "Shipped",
    shortDescription: "Raycast suspension, springs and air resistance, all configurable.",
    summary:
      "A realistic vehicle system with raycast suspension and a configurable handling model: springs, air resistance and more. Built to be modular and reusable.",
    overview:
      "Raycasts, body forces, custom physics and sounds, all combined to simulate realistic vehicle behaviour inside Roblox.",
    stats: [
      { label: "Delivery", value: "4 days" },
      { label: "From", value: "$400" },
    ],
    tags: ["Luau", "Physics", "Audio"],
    video: realVehVideo,
    image: still("realveh"),
  },
  {
    id: "orbsystem",
    title: "Orb System",
    category: "Gameplay system",
    platform: "Roblox",
    filters: ["systems", "roblox"],
    icon: "system",
    year: "2025",
    shortDescription: "Pooled orbs on custom physics: 512+ on screen at a stable frame rate.",
    summary:
      "Custom physics and clustered object pooling. No matter how many orbs are on screen, it keeps performing.",
    overview:
      "Orbs are pooled and reused instead of being created and destroyed on each spawn, and the motion runs on hand-rolled physics rather than the engine's. The result holds a stable frame rate with 512+ orbs live at once.",
    stats: [
      { label: "Delivery", value: "2 days" },
      { label: "From", value: "$70" },
    ],
    tags: ["Luau", "Object pooling", "Physics"],
    video: orbVideo,
    image: still("orbsystem"),
  },
  {
    id: "jumpugc",
    title: "Jump for UGC",
    category: "Roblox game",
    platform: "Roblox",
    filters: ["games", "roblox"],
    icon: "game",
    year: "2025",
    shortDescription: "Jump, clear obbies, earn gold and unlock free UGC items.",
    summary:
      "A 'Jump for UGC' game where players jump and complete obbies to earn gold and unlock free UGC items.",
    overview:
      "Built to be modular and easy to customize, using Roact and Nevermore Engine. A old small project I worked on years past.",
    stats: [
      { label: "Delivery", value: "3 days" },
      { label: "From", value: "$100" },
    ],
    tags: ["Luau", "Roact", "Nevermore"],
    video: jumpVideo,
    image: still("jumpugc"),
  },
];

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "games", label: "Games" },
  { id: "systems", label: "Systems" },
  { id: "web", label: "Web" },
  { id: "roblox", label: "Roblox" },
];

export const projectById = (id) => PROJECTS.find((p) => p.id === id);

export const FEATURED = PROJECTS.filter((p) => p.featured).slice(0, 4);

export const matchesFilter = (project, filterId) =>
  filterId === "all" || project.filters.includes(filterId);

export const countFor = (filterId) =>
  PROJECTS.filter((p) => matchesFilter(p, filterId)).length;

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function searchProjects(query, list = PROJECTS) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return list;

  return list.filter((p) => {
    const haystack = normalize(
      [p.title, p.category, p.platform, p.shortDescription, p.summary, p.status, p.year, ...p.tags]
        .filter(Boolean)
        .join(" ")
    );
    return words.every((word) => haystack.includes(word));
  });
}
