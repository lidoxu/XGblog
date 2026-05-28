function getCleanImageSrc(src: string) {
  try {
    const url = new URL(src, window.location.href);

    if (url.pathname !== '/_image') {
      return src;
    }

    const href = url.searchParams.get('href');

    if (!href) {
      return src;
    }

    const originalPath = decodeURIComponent(href).split('?')[0].replace(/\\/g, '/');
    const postsIndex = originalPath.indexOf('/blog/posts/');

    if (postsIndex === -1) {
      return src;
    }

    return originalPath.slice(postsIndex);
  } catch {
    return src;
  }
}

const images = Array.from(document.querySelectorAll<HTMLImageElement>('.prose img')).filter((image) => image.src);

images.forEach((image) => {
  const cleanSrc = getCleanImageSrc(image.currentSrc || image.src);

  if (cleanSrc !== image.src) {
    image.src = cleanSrc;
    image.removeAttribute('srcset');
  }

  image.dataset.fullSrc = cleanSrc;
});

if (images.length > 0) {
  let activeIndex = 0;

  const lightbox = document.createElement('div');
  lightbox.className = 'xg-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', '图片预览');
  lightbox.innerHTML = `
    <button class="xg-lightbox-close" type="button" aria-label="关闭图片预览">×</button>
    <button class="xg-lightbox-prev" type="button" aria-label="上一张图片">‹</button>
    <figure>
      <img alt="" />
      <figcaption><span class="xg-lightbox-caption"></span><span class="xg-lightbox-counter"></span></figcaption>
    </figure>
    <button class="xg-lightbox-next" type="button" aria-label="下一张图片">›</button>
  `;

  document.body.append(lightbox);

  const preview = lightbox.querySelector<HTMLImageElement>('img')!;
  const caption = lightbox.querySelector<HTMLElement>('.xg-lightbox-caption')!;
  const counter = lightbox.querySelector<HTMLElement>('.xg-lightbox-counter')!;
  const closeButton = lightbox.querySelector<HTMLButtonElement>('.xg-lightbox-close')!;
  const prevButton = lightbox.querySelector<HTMLButtonElement>('.xg-lightbox-prev')!;
  const nextButton = lightbox.querySelector<HTMLButtonElement>('.xg-lightbox-next')!;

  const render = () => {
    const image = images[activeIndex];
    const label = image.alt || '正文图片';

    preview.src = image.dataset.fullSrc || image.currentSrc || image.src;
    preview.alt = label;
    caption.textContent = label;
    counter.textContent = `${activeIndex + 1} / ${images.length}`;
  };

  const open = (index: number) => {
    activeIndex = index;
    render();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const move = (step: number) => {
    activeIndex = (activeIndex + step + images.length) % images.length;
    render();
  };

  images.forEach((image, index) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt || '正文图片'}，点击放大`);
    image.addEventListener('click', () => open(index));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(index);
      }
    });
  });

  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'ArrowLeft') {
      move(-1);
    } else if (event.key === 'ArrowRight') {
      move(1);
    }
  });
}
