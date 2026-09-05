'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollExpandMedia() {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-8 my-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-36 h-36 bg-amber-400/20 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-xl">
          <span className="text-7xl animate-bounce">🥔</span>
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500 animate-spin" style={{ animationDuration: '15s' }}></div>
        </div>

        <div className="space-y-2 max-w-2xl">
          <div className="inline-block bg-amber-200/80 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
            AI-POWERED TUBER TELEMETRY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-handwritten text-[#ffc800] drop-shadow-sm">
            Potato, Kudumba Unit Engine v4.2
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Combining state-of-the-art computer vision, surface laplacian roughness modeling, and emotional geometry analysis to detect spud trauma directly in your kitchen photos.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
