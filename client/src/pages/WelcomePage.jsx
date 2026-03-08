import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import BakeryParticles from '../components/BakeryParticles';

const FEATURES = [
  {
    icon: '🍞',
    title: 'Freshly Baked',
    desc: 'Every item is baked daily in small batches to ensure maximum flavor and quality.',
  },
  {
    icon: '🌿',
    title: 'Organic Ingredients',
    desc: 'We source only the finest organic flour, farm-fresh eggs, and seasonal local fruits.',
  },
  {
    icon: '💛',
    title: 'Handcrafted Love',
    desc: 'Our artisans put their heart into every swirl of frosting and pinch of dough.',
  },
];

const TAGS = ['No Maida', 'No Preservatives', 'No Sugar', 'No Gluten'];

const WelcomePage = () => {
  const brandRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const tagsRef = useRef(null);
  const ctaRef = useRef(null);
  const heroImageRef = useRef(null);
  const sectionTitleRef = useRef(null);
  const testimonialRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    // ---- Hero timeline ----
    const tl = anime.timeline({ easing: 'easeOutExpo' });

    // Brand name
    tl.add({
      targets: brandRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
    });

    // Title letters
    tl.add({
      targets: '.welcome-title .letter',
      opacity: [0, 1],
      translateY: [60, 0],
      rotateX: [90, 0],
      duration: 800,
      delay: anime.stagger(35),
    }, '-=300');

    // Tagline
    tl.add({
      targets: taglineRef.current,
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 600,
    }, '-=400');

    // Tags
    tl.add({
      targets: '.welcome-tag',
      opacity: [0, 1],
      scale: [0.6, 1],
      duration: 400,
      delay: anime.stagger(80),
      easing: 'easeOutBack',
    }, '-=300');

    // CTA button
    tl.add({
      targets: ctaRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.9, 1],
      duration: 500,
    }, '-=200');

    // Hero image
    tl.add({
      targets: heroImageRef.current,
      opacity: [0, 1],
      scale: [0.85, 1],
      translateX: [60, 0],
      duration: 900,
      easing: 'easeOutCubic',
    }, '-=800');

    // Gentle continuous float for hero logo
    anime({
      targets: heroImageRef.current,
      translateY: [-8, 8],
      duration: 4000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      delay: 1500,
    });

    // ---- "Why We're Special" section ----
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section title
            anime({
              targets: sectionTitleRef.current,
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 700,
              easing: 'easeOutExpo',
            });
            // Feature cards stagger
            anime({
              targets: '.feature-card',
              opacity: [0, 1],
              translateY: [50, 0],
              scale: [0.9, 1],
              duration: 600,
              delay: anime.stagger(150),
              easing: 'easeOutBack',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionTitleRef.current) observer.observe(sectionTitleRef.current);

    // Testimonial observer
    const testimonialObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: testimonialRef.current,
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });
            anime({
              targets: '.stat-box',
              opacity: [0, 1],
              scale: [0.7, 1],
              duration: 500,
              delay: anime.stagger(120),
              easing: 'easeOutBack',
            });
            testimonialObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (testimonialRef.current) testimonialObs.observe(testimonialRef.current);

    // ---- Infinite ambient animations ----
    anime({
      targets: '.welcome-blob',
      translateX: () => anime.random(-25, 25),
      translateY: () => anime.random(-25, 25),
      scale: () => [1, anime.random(10, 14) / 10],
      duration: () => anime.random(5000, 8000),
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });

    anime({
      targets: '.welcome-float-icon',
      translateY: () => anime.random(-12, 12),
      rotate: () => anime.random(-10, 10),
      duration: () => anime.random(3000, 5000),
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      delay: () => anime.random(0, 2000),
    });

    anime({
      targets: '.welcome-ring',
      scale: [1, 1.12],
      opacity: [0.25, 0.06],
      duration: 3500,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });

    return () => {
      observer.disconnect();
      testimonialObs.disconnect();
    };
  }, []);

  // Split title text into individual letters for animation
  const renderLetters = (text) =>
    text.split('').map((char, i) => (
      <span key={i} className="letter inline-block" style={{ opacity: 0 }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  return (
    <main className="welcome-page">
      <BakeryParticles count={25} />

      {/* Ambient decorations */}
      <div className="welcome-blob welcome-blob-1" />
      <div className="welcome-blob welcome-blob-2" />
      <div className="welcome-blob welcome-blob-3" />
      <div className="welcome-ring welcome-ring-1" />
      <div className="welcome-ring welcome-ring-2" />
      <span className="welcome-float-icon" style={{ top: '6%', left: '4%', fontSize: '1.6rem' }}>🧁</span>
      <span className="welcome-float-icon" style={{ top: '12%', right: '6%', fontSize: '1.3rem' }}>🍪</span>
      <span className="welcome-float-icon" style={{ bottom: '25%', left: '6%', fontSize: '1.4rem' }}>🥐</span>
      <span className="welcome-float-icon" style={{ bottom: '15%', right: '10%', fontSize: '1.5rem' }}>🍩</span>

      {/* ===== NAVIGATION BAR ===== */}
      <nav className="welcome-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <img src="/images/logo.jpeg" alt="Delicious Bites" className="h-10 w-auto object-contain logo-smooth" />
            <span className="font-display text-bakeryBrown text-lg tracking-wide">DELICIOUS BITES</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-bakeryBrown/70">
            <Link to="/menu" className="hover:text-bakeryPrimary transition-colors">Specialties</Link>
            <Link to="/menu" className="hover:text-bakeryPrimary transition-colors">Menu</Link>
            <Link to="/about" className="hover:text-bakeryPrimary transition-colors">Our Story</Link>
            <Link to="/login" className="hover:text-bakeryPrimary transition-colors font-medium">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-16 md:pt-14 md:pb-24 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left — Content */}
        <div className="space-y-5">
          <div ref={brandRef} className="flex items-center gap-3" style={{ opacity: 0 }}>
            <img src="/images/logo.jpeg" alt="Delicious Bites" className="h-12 w-auto object-contain logo-smooth" />
            <span className="font-display text-bakeryBrown text-base tracking-widest uppercase">Delicious Bites</span>
          </div>

          <h1 ref={titleRef} className="welcome-title">
            <span className="font-display text-5xl sm:text-6xl md:text-[4.2rem] text-bakeryBrown leading-[1.08] block">
              {renderLetters('DELICIOUS')}
            </span>
            <span className="font-display text-5xl sm:text-6xl md:text-[4.2rem] text-bakeryPrimary leading-[1.08] block font-bold">
              {renderLetters('BITES')}
            </span>
          </h1>

          <p ref={taglineRef} className="text-lg font-script text-bakeryPrimary/80" style={{ opacity: 0 }}>
            baking memories with love
          </p>

          {/* Quality tags */}
          <div ref={tagsRef} className="flex flex-wrap gap-2 pt-1">
            {TAGS.map((tag) => (
              <span key={tag} className="welcome-tag">
                <span className="text-bakeryPrimary mr-1">✦</span> {tag}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <Link
              ref={ctaRef}
              to="/home"
              className="welcome-get-started"
              style={{ opacity: 0 }}
            >
              Get Started
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right — Hero Image / Logo Area */}
        <div className="relative flex items-center justify-center">
          <div
            ref={heroImageRef}
            className="welcome-hero-image"
            style={{ opacity: 0 }}
          >
            {/* Soft glow behind logo */}
            <div className="welcome-hero-glow" />

            {/* Business Logo */}
            <img
              src="/images/logo.jpeg"
              alt="Delicious Bites - Baking memories with love"
              className="welcome-hero-logo-img logo-smooth"
            />
          </div>
        </div>
      </section>

      {/* ===== WAVE DIVIDER ===== */}
      <div className="welcome-wave-divider">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="white" />
        </svg>
      </div>

      {/* ===== WHY WE'RE SPECIAL ===== */}
      <section className="welcome-special-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div ref={sectionTitleRef} style={{ opacity: 0 }}>
            <h2 className="font-display text-2xl md:text-3xl text-bakeryBrown mb-2">Why We're Special</h2>
            <div className="w-12 h-1 bg-bakeryPrimary rounded-full mx-auto mb-3" />
            <p className="text-sm text-bakeryBrown/60 max-w-md mx-auto mb-10">
              More than just a bakery, we are a family dedicated to bringing sweetness into your everyday moments.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card" style={{ opacity: 0 }}>
                <div className="feature-card-icon">{f.icon}</div>
                <h3 className="font-semibold text-bakeryBrown text-base mt-4 mb-2">{f.title}</h3>
                <p className="text-xs text-bakeryBrown/65 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL + STATS ===== */}
      <section className="welcome-testimonial-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div ref={testimonialRef} className="welcome-testimonial-card" style={{ opacity: 0 }}>
            <div className="flex-1">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-bakeryPrimary text-sm">★</span>
                ))}
              </div>
              <blockquote className="text-base md:text-lg text-bakeryBrown font-medium italic leading-relaxed mb-3">
                "The best macaroons I've ever had. You can taste the love in every bite!"
              </blockquote>
              <p className="text-xs text-bakeryBrown/55">— Emily Rogers, Local Food Enthusiast</p>
            </div>

            <div className="flex gap-4 mt-6 md:mt-0 md:ml-8 shrink-0">
              <div className="stat-box" style={{ opacity: 0 }}>
                <span className="text-2xl font-bold text-bakeryPrimary">500+</span>
                <span className="text-[10px] text-bakeryBrown/55 mt-1">Happy Orders</span>
              </div>
              <div className="stat-box" style={{ opacity: 0 }}>
                <span className="text-2xl font-bold text-bakeryPrimary">4.9/5</span>
                <span className="text-[10px] text-bakeryBrown/55 mt-1">Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer ref={footerRef} className="welcome-footer">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/logo.jpeg" alt="Delicious Bites" className="h-10 w-auto object-contain logo-smooth" />
              <span className="font-display text-bakeryBrown text-base">DELICIOUS BITES</span>
            </div>
            <p className="text-xs text-bakeryBrown/60 leading-relaxed">
              Baking memories with love since 2023.<br />
              Fresh, organic, and always delicious.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-bakeryBrown mb-3 text-xs uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-bakeryBrown/60">
              <li><Link to="/menu" className="hover:text-bakeryPrimary transition-colors">Full Menu</Link></li>
              <li><Link to="/menu" className="hover:text-bakeryPrimary transition-colors">Specialties</Link></li>
              <li><Link to="/about" className="hover:text-bakeryPrimary transition-colors">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bakeryBrown mb-3 text-xs uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs text-bakeryBrown/60">
              <li>Delivery Info</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bakeryBrown mb-3 text-xs uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-bakeryBrown/60 mb-3">Get sweet updates in your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-full border border-bakeryPink px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-bakeryPrimary/30"
                readOnly
              />
              <button className="rounded-full bg-bakeryPrimary text-white text-xs px-4 py-1.5 font-medium hover:bg-[#ff4f7b] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-bakeryPink/30 text-center py-4 text-[11px] text-bakeryBrown/40">
          © 2025 Delicious Bites. Made with 💛
        </div>
      </footer>
    </main>
  );
};

export default WelcomePage;
