'use client';

import { useEffect, useState } from 'react';
import { Scale, Gavel, Sparkles, Shield, Cpu } from 'lucide-react';

interface QuantumPortalTransitionProps {
  isTransitioning: boolean;
  spudCount?: number;
  onComplete: () => void;
}

export default function QuantumPortalTransition({
  isTransitioning,
  spudCount = 4,
  onComplete,
}: QuantumPortalTransitionProps) {
  const [logStep, setLogStep] = useState(0);

  useEffect(() => {
    if (!isTransitioning) {
      setLogStep(0);
      return;
    }

    const timer1 = setTimeout(() => setLogStep(1), 300);
    const timer2 = setTimeout(() => setLogStep(2), 700);
    const timer3 = setTimeout(() => setLogStep(3), 1100);
    const timer4 = setTimeout(() => setLogStep(4), 1500);
    const timer5 = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isTransitioning, onComplete]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0c0704] text-amber-100 flex flex-col justify-between p-6 sm:p-12 overflow-hidden font-mono select-none animate-in fade-in duration-200">
      
      {/* 3D Warp Grid Background Effect */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-[-50%] w-[200%] h-[200%] bg-repeat animate-spin"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245, 158, 11, 0.4) 1px, transparent 0)`,
            backgroundSize: '36px 36px',
            animationDuration: '25s',
          }}
        />
        <div className="absolute inset-0 bg-radial-vignette bg-gradient-to-t from-[#0c0704] via-transparent to-[#0c0704]" />
      </div>

      {/* Concentric Energy Shockwaves */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-amber-500/30 animate-ping" style={{ animationDuration: '1.2s' }} />
        <div className="w-[450px] h-[450px] sm:w-[700px] sm:h-[700px] rounded-full border border-amber-400/20 animate-ping" style={{ animationDuration: '1.8s' }} />
      </div>

      {/* Laser Scanning Line */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_25px_#f59e0b] animate-bounce top-1/2 -translate-y-1/2 pointer-events-none" />

      {/* TOP STATUS HEADER */}
      <div className="relative z-10 flex items-center justify-between border-b border-amber-900/60 pb-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm tracking-widest uppercase">
          <Cpu className="w-5 h-5 text-amber-500 animate-pulse" />
          <span>QUANTUM JUDICIAL TELEPORTATION PORTAL v4.2</span>
        </div>
        <div className="text-[11px] text-amber-500/80 font-mono tracking-widest uppercase hidden sm:block">
          STATUS: HYPER-WARP ENGAGED
        </div>
      </div>

      {/* CENTER HOLOGRAPHIC EMBLAZONED ICON & LOGS */}
      <div className="relative z-10 max-w-xl mx-auto w-full text-center space-y-6">
        
        {/* Animated Gavel / Scale Portal Emblem */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-[#180e07] border-2 border-amber-500/60 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.4)] transform hover:scale-110 transition-transform">
            <Gavel className="w-14 h-14 sm:w-16 sm:h-16 text-amber-400 animate-bounce" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-amber-100 tracking-wider uppercase drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            ENTERING THE POTATO COURT
          </h2>
          <p className="text-xs sm:text-sm text-amber-400/90 font-mono tracking-widest mt-1">
            TRANSITIONING TELEMETRY TO THE HONORABLE JUDGE SPUD
          </p>
        </div>

        {/* Dynamic Holographic Telemetry Terminal */}
        <div className="bg-[#120904]/90 border border-amber-800/80 rounded-xl p-4 text-left font-mono text-xs space-y-2 shadow-2xl backdrop-blur-md">
          <div className="text-amber-600 font-bold border-b border-amber-900/50 pb-1.5 flex justify-between text-[11px]">
            <span>WARP LOG RECORD</span>
            <span className="text-emerald-400">TELEPORTING {spudCount} SPUDS</span>
          </div>

          <div className="space-y-1.5 pt-1 text-amber-200">
            {logStep >= 0 && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <span className="text-amber-500 font-bold">[00.12s]</span>
                <span>Initializing Comparative Trauma Tribunal Protocol...</span>
              </div>
            )}
            {logStep >= 1 && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <span className="text-amber-500 font-bold">[00.45s]</span>
                <span>Extracting {spudCount} cropped spud bounding box telemetry...</span>
              </div>
            )}
            {logStep >= 2 && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <span className="text-amber-500 font-bold">[00.82s]</span>
                <span>Authenticating Plaintiff & Defendant litigant personas...</span>
              </div>
            )}
            {logStep >= 3 && (
              <div className="flex items-center gap-2 animate-in fade-in text-amber-300 font-bold">
                <span className="text-amber-500">[01.20s]</span>
                <span>Summoning The Honorable Judge Spud Chambers...</span>
              </div>
            )}
            {logStep >= 4 && (
              <div className="flex items-center gap-2 animate-in fade-in text-emerald-400 font-bold">
                <span className="text-emerald-500">[01.60s]</span>
                <span>✓ PORTAL STABILIZED — OPENING COURTROOM DOORS!</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM PROGRESS BAR & INDICATOR */}
      <div className="relative z-10 max-w-xl mx-auto w-full space-y-2">
        <div className="flex justify-between text-xs text-amber-400 font-mono font-bold">
          <span>PORTAL SYNCHRONIZATION</span>
          <span>{Math.min(100, Math.floor((logStep + 1) * 20))}%</span>
        </div>
        <div className="w-full bg-[#180e07] h-3 rounded-full overflow-hidden border border-amber-800/80 p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 h-full rounded-full transition-all duration-300 shadow-[0_0_15px_#fbbf24]"
            style={{ width: `${Math.min(100, (logStep + 1) * 20)}%` }}
          />
        </div>
      </div>

    </div>
  );
}
