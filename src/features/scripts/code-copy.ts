const codeBlocks = document.querySelectorAll<HTMLElement>('.prose pre');
const languageLabels: Record<string, string> = {
  bash: 'BASH',
  css: 'CSS',
  html: 'HTML',
  js: 'JS',
  javascript: 'JS',
  json: 'JSON',
  md: 'MD',
  markdown: 'MD',
  sh: 'SH',
  shell: 'SHELL',
  ts: 'TS',
  typescript: 'TS',
  yaml: 'YAML',
  yml: 'YAML',
};

for (const pre of codeBlocks) {
  const code = pre.querySelector('code');

  if (!code || pre.querySelector('.copy-code')) {
    continue;
  }

  const language =
    pre.dataset.language ||
    [...pre.classList, ...code.classList]
      .find((className) => className.startsWith('language-'))
      ?.replace('language-', '');
  const label = language ? languageLabels[language.toLowerCase()] : undefined;

  if (label) {
    pre.dataset.languageLabel = label;
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
