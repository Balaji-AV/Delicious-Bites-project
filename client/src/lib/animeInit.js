let isInitialized = false;

export const initializeAnime = async ({ selector = '[data-anim]', options = {} } = {}) => {
  if (isInitialized) return null;

  const targets = document.querySelectorAll(selector);
  if (!targets.length) return null;

  // The caller can install anime.js later and this bootstrap will start working.
  const dynamicImport = new Function('mod', 'return import(mod)');
  const animeModule = await dynamicImport('animejs').catch(() => null);
  const anime = animeModule?.default || animeModule?.anime || animeModule;

  if (!anime) {
    return null;
  }

  isInitialized = true;

  return anime({
    targets,
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(80),
    easing: 'easeOutQuart',
    duration: 700,
    ...options
  });
};

export const resetAnimeBootstrap = () => {
  isInitialized = false;
};
