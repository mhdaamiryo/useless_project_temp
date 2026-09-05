'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Button } from '@/components/ui/button-1';
import PotatoKudumbaUnitLogo from '@/components/logo';
import { Sparkles, ArrowRight, Scale } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <header className="flex justify-between items-center py-4 border-b border-amber-200/60 mb-8">
        <PotatoKudumbaUnitLogo size="sm" />

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI ENGINE v4.2 ONLINE
          </span>
        </div>
      </header>

      {/* Main Content Hero */}
      <div className="flex flex-col items-center text-center my-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Official Root Vegetable Trauma Registry</span>
          </div>

          {/* User Provided Handwritten Logo */}
          <div className="py-2 transform hover:scale-105 transition-transform">
            <PotatoKudumbaUnitLogo size="lg" />
          </div>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Determining which potato in your kitchen has suffered the most emotional and geometric trauma using high-precision computer vision.
          </p>

          {/* Action Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/upload">
              <Button size="lg" className="gap-2 text-base shadow-xl bg-amber-500 hover:bg-amber-600 text-white font-black">
                <span>Upload Potato Photo</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/results">
              <Button variant="outline" size="lg" className="gap-2 text-base border-amber-300 hover:bg-amber-50 text-amber-950 font-black">
                <Scale className="w-5 h-5 text-amber-600" />
                <span>View Leaderboard</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Expansion Feature Media Component */}
        <ScrollExpandMedia />
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200/80 text-center text-xs font-semibold text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2026 POTATO KUDUMBA UNIT (കിഴങ്ങൻ കുടുംബ യൂണിറ്റ്). All spud rights reserved.</p>
        <div className="flex items-center gap-4 text-amber-700 font-bold">
          <span>Emotional AI v4.2</span>
          <span>•</span>
          <span>Root Vegetable Tribunal</span>
        </div>
      </footer>
    </div>
  );
}
