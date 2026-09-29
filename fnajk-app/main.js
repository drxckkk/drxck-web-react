import { dotnet } from './_framework/dotnet.js';

const canvas = document.getElementById('canvas');
const status = document.getElementById('status');

const say = (msg) => { if (status) status.textContent = msg; };

// A dropped request aborts the boot, and phones drop them, so every fetch here
// is retried. A real HTTP error (404/500) is returned as-is so genuine
// mistakes still fail fast instead of being retried five times.
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
      await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
    }
  }
  throw lastError;
}

// The game content ships as a few ~12 MB parts instead of 643 separate files
// (see tools/wasm/pack-assets.py for the record layout). They are fetched one
// at a time and unpacked straight into emscripten's filesystem, so peak memory
// stays at about one part rather than the whole 90 MB of assets at once.
async function unpackGameData(module) {
  // The manifest is always revalidated; the parts it names carry a hash of
  // their contents, so they can be cached for as long as the browser likes and
  // an update still reaches everyone (see tools/wasm/pack-assets.py).
  const manifest = await (await fetchWithRetry('gamedata.json', { cache: 'no-cache' })).json();
  const { FS } = module;
  const known = new Set();
  let done = 0;

  for (const part of manifest.parts) {
    const res = await fetchWithRetry(part.name, { cache: 'default' });
    if (!res.ok) throw new Error(`${part.name}: HTTP ${res.status}`);
    const view = new DataView(await res.arrayBuffer());
    const bytes = new Uint8Array(view.buffer);
    const decoder = new TextDecoder();
    let at = 0;

    while (at < view.byteLength) {
      const pathLength = view.getUint16(at, true);
      at += 2;
      const path = decoder.decode(bytes.subarray(at, at + pathLength));
      at += pathLength;
      const size = view.getUint32(at, true);
      at += 4;

      const full = `${manifest.prefix}/${path}`;
      const dir = full.slice(0, full.lastIndexOf('/'));
      if (!known.has(dir)) {
        FS.mkdirTree(dir);
        known.add(dir);
      }
      FS.writeFile(full, bytes.subarray(at, at + size));
      at += size;
    }

    done += part.bytes;
    say(`Loading… ${Math.round((done / manifest.bytes) * 100)}%`);
  }

  if (done < manifest.bytes) throw new Error('game data incomplete');
}

// Saves live in emscripten's in-memory filesystem, which a page reload wipes -
// so Continue, the night reached and every unlock were lost on refresh. The
// save directory is mounted on IndexedDB instead: loaded before the game starts
// (restoreSaves), and flushed shortly after each write (fnajk.persist, called
// from EventManager). Private browsing or blocked storage just means saves stay
// in memory for the session, same as before - nothing fails.
const SAVE_ROOT = '/persist';
let saveFs = null;
let persistTimer = 0;

function restoreSaves(module) {
  const { FS } = module;
  const IDBFS = FS.filesystems && FS.filesystems.IDBFS;
  if (!IDBFS) return;
  try {
    FS.mkdirTree(SAVE_ROOT);
    FS.mount(IDBFS, {}, SAVE_ROOT);
  } catch (err) {
    console.warn('Save storage unavailable:', err);
    return;
  }
  saveFs = FS;
  module.addRunDependency('saves');
  FS.syncfs(true, (err) => {
    if (err) console.warn('Could not load saves:', err);
    module.removeRunDependency('saves');
  });
}

globalThis.fnajk = {
  // Android only; iOS Safari has no vibration API and ignores it.
  vibrate(ms) {
    try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
  },
  // Coalesces bursts of saves (a script may set several values in a row)
  // into one IndexedDB write.
  persist() {
    if (!saveFs) return;
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      saveFs.syncfs(false, (err) => { if (err) console.warn('Could not save:', err); });
    }, 250);
  },
};

try {
  say('Starting runtime…');

  // ?test=night4 starts straight into a night, the way `fnajk play 4` passes
  // /test:night4 on the desktop. Without it the game boots normally.
  const test = new URLSearchParams(location.search).get('test');
  const args = test && /^night[1-5]$/.test(test) ? [`/test:${test}`] : [];

  const { runMain } = await dotnet
    .withApplicationArguments(...args)
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
      preRun: (module) => {
        // raylib's GLFW shim finds its drawing surface through Module.canvas.
        module.canvas = canvas;
        // A run dependency holds main() back until the assets are in the
        // filesystem - the same mechanism emscripten's own --preload-file uses.
        module.addRunDependency('gamedata');
        unpackGameData(module).then(
          () => module.removeRunDependency('gamedata'),
          (err) => { say('Failed to load game data: ' + err); },
        );
        restoreSaves(module);
      },
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
