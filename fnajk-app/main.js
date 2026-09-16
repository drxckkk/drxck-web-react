import { dotnet } from './_framework/dotnet.js';

const canvas = document.getElementById('canvas');
const status = document.getElementById('status');

const say = (msg) => { if (status) status.textContent = msg; };

try {
  say('Starting runtime…');
  const { runMain } = await dotnet
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
