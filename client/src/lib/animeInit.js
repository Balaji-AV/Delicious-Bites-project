import anime from 'animejs';

let isInitialized = false;

export const initializeAnime = ({ selector = '[data-anim]', options = {} } = {}) => {
  const targets = document.querySelectorAll(selector);
  if (!targets.length) return null;

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
