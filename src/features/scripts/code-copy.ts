const codeBlocks = document.querySelectorAll<HTMLElement>('.prose pre');

for (const pre of codeBlocks) {
  const code = pre.querySelector('code');

  if (!code || pre.querySelector('.copy-code')) {
    continue;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code';
  button.textContent = '复制';
  button.setAttribute('aria-label', '复制代码');

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
      button.textContent = '已复制';
      setTimeout(() => {
        button.textContent = '复制';
      }, 1600);
    } catch {
      button.textContent = '复制失败';
      setTimeout(() => {
        button.textContent = '复制';
      }, 1600);
    }
  });

  pre.append(button);
}
