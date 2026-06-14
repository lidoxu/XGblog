import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(`${npmCommand} run build`, {
  env: {
    ...process.env,
    XG_BLOG_SKIP_NOT_FOUND_REDIRECTS: 'true',
  },
  shell: true,
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
