'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function PotatoKudumbaUnitLogo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-2xl gap-1',
    md: 'text-3xl sm:text-4xl gap-1.5',
    lg: 'text-4xl sm:text-6xl gap-2',
  };

  const spudSizes = {
    sm: 'w-6 h-6 text-base',
    md: 'w-8 h-8 sm:w-10 sm:h-10 text-xl',
    lg: 'w-12 h-12 sm:w-16 sm:h-16 text-3xl',
  };

  return (
    <Link href="/" className="inline-flex flex-col items-center select-none group">
      <div className={`font-handwritten font-extrabold tracking-wide text-[#ffc800] drop-shadow-[0_2px_10px_rgba(255,200,0,0.3)] flex flex-col items-center leading-none ${sizeClasses[size]}`}>
        {/* Line 1: Potato, */}
        <div className="flex items-center gap-0.5">
          <span>P</span>
          <div className={`relative rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform ${spudSizes[size]}`}>
            <span className="animate-pulse">🥔</span>
          </div>
          <span>tato,</span>
        </div>

        {/* Line 2: Kudumba Unit */}
        <div className="text-[#ffc800] tracking-tight -mt-1 sm:-mt-2">
          Kudumba Unit
        </div>
      </div>
    </Link>
  );
}
