import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const astroBin = fileURLToPath(new URL('../node_modules/astro/astro.js', import.meta.url));
const child = spawn(process.execPath, [astroBin, 'dev', ...process.argv.slice(2)], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
