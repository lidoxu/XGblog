const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
const headings = Array.from(document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id], .prose h4[id]'));

if (tocLinks.length > 0 && headings.length > 0) {
  const topOffset = 96;
  const linkById = new Map(
    tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]),
  );

  const setActive = (id: string) => {
    const activeLink = linkById.get(id);
    if (!activeLink) {
      return;
    }

    const activeItem = activeLink.closest<HTMLElement>('[data-toc-item]');
    const activeH2 = activeItem?.dataset.parentH2 ?? '';
    const activeH3 = activeItem?.dataset.parentH3 ?? '';

    for (const link of tocLinks) {
      const item = link.closest<HTMLElement>('[data-toc-item]');
      const depth = Number(item?.dataset.depth ?? 2);
      const itemH2 = item?.dataset.parentH2 ?? '';
      const itemH3 = item?.dataset.parentH3 ?? '';
      const isActive = link === activeLink;
      const isVisible =
        depth === 2 ||
        (depth === 3 && itemH2 === activeH2) ||
        (depth === 4 && itemH2 === activeH2 && (activeH3 ? itemH3 === activeH3 : !itemH3));

      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
      item?.classList.toggle('is-active', isActive);
      item?.classList.toggle('is-visible', isVisible);
    }
  };

  const updateActive = () => {
    let currentId = headings[0]?.id;

    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= topOffset) {
        currentId = heading.id;
      } else {
        break;
      }
    }

    if (currentId) {
      setActive(currentId);
    }
  };

  let ticking = false;
  const scheduleUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
  };

  for (const link of tocLinks) {
    link.addEventListener('click', () => {
      const id = decodeURIComponent(link.hash.slice(1));
      if (id) {
        setActive(id);
      }
    });
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('hashchange', scheduleUpdate);
  updateActive();
}
