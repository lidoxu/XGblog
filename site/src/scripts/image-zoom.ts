import mediumZoom from 'medium-zoom';

const getZoomBackground = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--zoom-backdrop').trim() || 'rgba(28, 28, 30, 0.96)';

const getZoomMargin = () => (window.matchMedia('(max-width: 720px)').matches ? 10 : 24);

const zoom = mediumZoom('.prose img', {
  background: getZoomBackground(),
  margin: getZoomMargin(),
});

const refreshZoom = () => {
  zoom.update({
    background: getZoomBackground(),
    margin: getZoomMargin(),
  });
};

window.addEventListener('resize', refreshZoom);
window.addEventListener('xg-theme-change', refreshZoom);
