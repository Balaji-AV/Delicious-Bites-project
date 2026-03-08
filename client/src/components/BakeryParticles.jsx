import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

// Bakery-themed SVG shapes for particles
const PARTICLE_SHAPES = [
  // Sprinkle (rectangle)
  (color) => `<rect width="8" height="3" rx="1.5" fill="${color}" />`,
  // Round sprinkle
  (color) => `<circle cx="4" cy="4" r="4" fill="${color}" />`,
  // Star shape
  (color) => `<polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 9.5,12 6,9 2.5,12 3.5,7.5 0,4.5 4.5,4.5" fill="${color}" />`,
  // Heart
  (color) => `<path d="M6 11 C6 11 1 7 1 4 C1 2 2.5 0.5 4 1.5 C5 2.2 5.6 3 6 3.5 C6.4 3 7 2.2 8 1.5 C9.5 0.5 11 2 11 4 C11 7 6 11 6 11Z" fill="${color}" />`,
  // Donut (circle with hole - using two circles)
  (color) => `<circle cx="6" cy="6" r="6" fill="${color}" /><circle cx="6" cy="6" r="2.5" fill="#fffdf8" />`,
  // Small cookie circle
  (color) => `<circle cx="5" cy="5" r="5" fill="${color}" opacity="0.85" /><circle cx="3.5" cy="3.5" r="0.8" fill="#5C4033" opacity="0.5" /><circle cx="6" cy="4" r="0.8" fill="#5C4033" opacity="0.5" /><circle cx="4.5" cy="6.5" r="0.8" fill="#5C4033" opacity="0.5" />`,
];

const COLORS = [
  '#ff6f91', '#ffc8dd', '#ffafcc', '#d8f3dc',
  '#ffe5ec', '#ffd6e0', '#E8A87C', '#f8c8dc',
  '#c7f0db', '#ffb7c5',
];

const BakeryParticles = ({ count = 30 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear old particles
    container.innerHTML = '';

    const particles = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'bakery-particle';

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const shape = PARTICLE_SHAPES[Math.floor(Math.random() * PARTICLE_SHAPES.length)];
      const size = 10 + Math.random() * 18;

      el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">${shape(color)}</svg>`;

      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `-${20 + Math.random() * 40}px`;
      el.style.opacity = '0';

      container.appendChild(el);
      particles.push(el);
    }

    // Animate particles falling like sprinkles
    const animation = anime({
      targets: particles,
      translateY: () => [
        anime.random(-50, 0),
        window.innerHeight + anime.random(50, 200)
      ],
      translateX: () => [
        anime.random(-30, 30),
        anime.random(-80, 80)
      ],
      rotate: () => anime.random(-720, 720),
      opacity: [
        { value: [0, 0.8], duration: 400 },
        { value: [0.8, 0], duration: 800, delay: 3000 }
      ],
      scale: () => [anime.random(5, 10) / 10, anime.random(8, 14) / 10],
      duration: () => anime.random(4000, 8000),
      delay: () => anime.random(0, 4000),
      easing: 'easeInOutQuad',
      loop: true,
    });

    return () => {
      animation.pause();
      container.innerHTML = '';
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="bakery-particles-container"
      aria-hidden="true"
    />
  );
};

export default BakeryParticles;
