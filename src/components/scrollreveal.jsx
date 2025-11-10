import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Add reveal classes and stagger delays to common section containers
    const GROUP_CONTAINERS = ['.row', '.gallery-grid', '.mini-cards', 'section', 'article', '.container'];
    GROUP_CONTAINERS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((container) => {
        const children = Array.from(container.children || []);
        children.forEach((child, index) => {
          if (!child.classList.contains('reveal-on-scroll')) child.classList.add('reveal-on-scroll');
          if (!reduceMotion) child.style.setProperty('--sr-delay', `${index * 70}ms`);
          // assign a variant class for cooler motions
          child.classList.remove('sr-left', 'sr-right', 'sr-zoom');
          const variant = index % 3;
          if (variant === 0) child.classList.add('sr-left');
          else if (variant === 1) child.classList.add('sr-right');
          else child.classList.add('sr-zoom');
        });
      });
    });

    const SELECTORS = [
      'section',
      'article',
      '.container',
      '.row > *',
      '.card',
      'img',
      'h1',
      'h2',
      'h3',
      'p',
      'li',
      '.btn',
      '.reveal-on-scroll'
    ].join(',');

    const elements = Array.from(document.querySelectorAll(SELECTORS));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
      if (reduceMotion) {
        el.classList.add('sr-show');
      } else if (!el.classList.contains('sr-show')) {
        el.classList.add('sr-init');
        observer.observe(el);
      }
    });

    // Tilt: subtle 3D tilt on hover
    const tiltEls = Array.from(document.querySelectorAll('.tilt'));
    const tiltMaxX = 6; // deg
    const tiltMaxY = 8; // deg
    const handleTiltMove = (e) => {
      const el = e.currentTarget;
      if (!el.classList.contains('sr-show')) return; // wait until revealed
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotY = Math.max(-1, Math.min(1, dx)) * tiltMaxY;
      const rotX = -Math.max(-1, Math.min(1, dy)) * tiltMaxX;
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1)`;
    };
    const handleTiltLeave = (e) => {
      const el = e.currentTarget;
      el.style.transform = '';
    };
    tiltEls.forEach((el) => {
      el.addEventListener('mousemove', handleTiltMove);
      el.addEventListener('mouseleave', handleTiltLeave);
    });

    // Parallax: vertical translate based on scroll
    const parallaxEls = Array.from(document.querySelectorAll('.parallax-y'));
    let raf = 0;
    const updateParallax = () => {
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '0.15');
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight || 800;
        const offset = ((rect.top + rect.height / 2) - viewportH / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        updateParallax();
        raf = 0;
      });
    };
    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      tiltEls.forEach((el) => {
        el.removeEventListener('mousemove', handleTiltMove);
        el.removeEventListener('mouseleave', handleTiltLeave);
      });
      if (raf) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  return null;
}

export default ScrollReveal;
