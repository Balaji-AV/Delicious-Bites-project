import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

const PageLoader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const cupcakeRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = anime.timeline({ easing: 'easeOutExpo' });

    // Animate the cupcake icon bouncing in
    tl.add({
      targets: cupcakeRef.current,
      scale: [0, 1],
      rotate: ['-45deg', '0deg'],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutBack',
    });

    // Animate text
    tl.add({
      targets: textRef.current,
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 400,
    }, '-=200');

    // Animate progress bar
    tl.add({
      targets: { val: 0 },
      val: 100,
      round: 1,
      duration: 1200,
      easing: 'easeInOutQuad',
      update: (anim) => {
        const val = Math.round(anim.animations[0].currentValue);
        setProgress(val);
        if (progressRef.current) {
          progressRef.current.style.width = val + '%';
        }
      },
    }, '-=100');

    // Fade out the loader
    tl.add({
      targets: loaderRef.current,
      opacity: [1, 0],
      scale: [1, 1.05],
      duration: 500,
      easing: 'easeInQuad',
      complete: () => onComplete?.(),
    }, '+=200');

    return () => tl.pause();
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="page-loader"
    >
      {/* Floating sprinkles in loader */}
      <div className="loader-sprinkles">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="loader-sprinkle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              backgroundColor: ['#ff6f91', '#ffc8dd', '#d8f3dc', '#ffafcc', '#ffe5ec', '#ffd6e0'][i % 6],
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div className="loader-content">
        {/* Business Logo */}
        <div ref={cupcakeRef} className="loader-icon">
          <img src="/images/logo.jpeg" alt="Delicious Bites" className="w-32 h-auto object-contain logo-smooth drop-shadow-lg" />
        </div>

        <p ref={textRef} className="loader-text">Delicious Bites</p>

        {/* Progress bar */}
        <div className="loader-progress-track">
          <div ref={progressRef} className="loader-progress-bar" />
        </div>
        <span className="loader-percent">{progress}%</span>
      </div>
    </div>
  );
};

export default PageLoader;
