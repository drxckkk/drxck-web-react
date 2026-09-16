import { dotnet } from './_framework/dotnet.js';

const canvas = document.getElementById('canvas');
const status = document.getElementById('status');

const say = (msg) => { if (status) status.textContent = msg; };

// The game ships ~640 asset files, and the loader fetches them in parallel.
// iOS Safari is far stricter than Chrome about that: under the pressure it
// drops individual requests, which surface as a bare "Load failed" TypeError and
// abort the whole boot ("failed to download .../14_game.json"). Throttling the
// fan-out and retrying a dropped request fixes it; a real HTTP error (404/500)
// is returned as-is so genuine mistakes still fail fast.
const RETRIES = 4;

async function fetchWithRetry(url, init) {
  let lastError;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.ok || res.status >= 400) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    if (attempt < RETRIES) {
      await new Promise((r) => setTimeout(r, 150 * 2 ** attempt));
    }
  }
  throw lastError;
}

try {
  say('Starting runtime…');

  const { runMain } = await dotnet
    .withConfig({
      maxParallelDownloads: 4,
      loadBootResource: (type, name, defaultUri, integrity) => {
        // The loader requires a URL string for 'dotnetjs', not a Response.
        if (type === 'dotnetjs') return undefined;
        return fetchWithRetry(defaultUri, {
          cache: 'default',
          integrity: integrity || undefined,
        });
      },
    })
    .withModuleConfig({
      canvas,
      // raylib's GLFW shim finds its drawing surface through Module.canvas.
      preRun: (module) => { module.canvas = canvas; },
      print: (t) => console.log(t),
      printErr: (t) => console.error(t),
    })
    .create();

  say('');
  await runMain();
} catch (err) {
  console.error(err);
  say('Failed to start: ' + err);
}
