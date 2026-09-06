'use client';

import { useEffect, useRef, useState } from 'react';

export default function MouseSpotlight() {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch / mobile devices
    if (typeof window === 'undefined') return;
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouchDevice) return;

    let animationFrameId: number;

    // Target position (where the mouse cursor is)
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    // Current position (smooth lerp towards target)
    let currentX = targetX;
    let currentY = targetY;

    let isMouseInWindow = false;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isMouseInWindow) {
        isMouseInWindow = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      isMouseInWindow = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isMouseInWindow = true;
      setIsVisible(true);
    };

    // Smooth animation loop using lerp (linear interpolation)
    const animate = () => {
      // Smooth easing factor 0.08 gives a fluid, cinematic motion lag
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (spotlightRef.current) {
        // Center the 650px spotlight sphere on the cursor
        spotlightRef.current.style.transform = `translate3d(${currentX - 325}px, ${currentY - 325}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        background: `radial-gradient(
          circle,
          rgba(251, 191, 36, 0.15) 0%,
          rgba(245, 158, 11, 0.08) 25%,
          rgba(217, 119, 6, 0.03) 55%,
          rgba(0, 0, 0, 0) 80%
        )`,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform, opacity',
        transition: 'opacity 0.5s ease',
        opacity: isVisible ? 1 : 0,
        mixBlendMode: 'screen',
      }}
    />
  );
}
