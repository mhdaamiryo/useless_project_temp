'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button-1';
import { Badge } from '@/components/ui/badge-2';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PotatoKudumbaUnitLogo from '@/components/logo';
import QuantumPortalTransition from '@/components/quantum-portal-transition';
import { ArrowLeft, Scale, Play, Pause, Trophy, Sparkles, Gavel, Zap } from 'lucide-react';

interface PotatoData {
  id: number;
  title: string;
  persona: string;
  irregularity: number;
  roughness: number;
  uniqueness: number;
  dramaScore: number;
  malayalamQuote: string;
  box?: [number, number, number, number];
  cropUrl?: string;
}

const DEFAULT_POTATOES: PotatoData[] = [
  {
    id: 4,
    title: 'Potato #4',
    persona: 'The Tragic Hero',
    irregularity: 92,
    roughness: 87,
    uniqueness: 95,
    dramaScore: 96.8,
    malayalamQuote: 'ഇവൻ കണ്ട അനുഭവങ്ങൾ നമ്മൾ സ്വപ്നത്തിൽ പോലും കണ്ടിട്ടില്ല! 😭🌾',
    cropUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Potato #2',
    persona: 'Quietly Unraveling',
    irregularity: 78,
    roughness: 81,
    uniqueness: 74,
    dramaScore: 83.4,
    malayalamQuote: 'പുറമെ ശാന്തൻ, ഉള്ളിൽ അണപൊട്ടുന്ന കണ്ണീർക്കടൽ! 🎭🥔',
    cropUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 1,
    title: 'Potato #1',
    persona: 'The Main Character',
    irregularity: 65,
    roughness: 70,
    uniqueness: 88,
    dramaScore: 76.2,
    malayalamQuote: 'ക്യാമറക്കണ്ണുകൾ എപ്പോഴും ഇയാളുടെ പുറകെയാണ്, ആറ്റിറ്റ്യൂഡ് കിങ്! ✨😎',
    cropUrl: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Potato #3',
    persona: 'Emotionally Stable',
    irregularity: 20,
    roughness: 35,
    uniqueness: 15,
    dramaScore: 21.4,
    malayalamQuote: 'യാതൊരു കുഴപ്പവുമില്ലാതെ കൂളായി ജീവിക്കുന്ന സമാധാനപ്രിയൻ! 🧘‍♂️✨',
    cropUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop',
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const [potatoes, setPotatoes] = useState<PotatoData[]>(DEFAULT_POTATOES);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number>(4);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [isWarpingToCourt, setIsWarpingToCourt] = useState<boolean>(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem('spud_analysis_data');
    const storedImg = sessionStorage.getItem('spud_image_url');

    if (storedImg) {
      setUserImageUrl(storedImg);
    }

    if (storedData) {
      try {
        const parsed: PotatoData[] = JSON.parse(storedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPotatoes(parsed);
          setActiveId(parsed[0].id);
        }
      } catch (err) {
        console.error('Failed to parse spud_analysis_data:', err);
      }
    }
  }, []);

  const spotlightSequence = potatoes.map((p) => p.id);
  const activePotato = potatoes.find((p) => p.id === activeId) || potatoes[0];
  const winnerPotato = potatoes[0];

  useEffect(() => {
    if (!isAutoplay || spotlightSequence.length <= 1) return;
    const timer = setInterval(() => {
      setActiveId((prevId) => {
        const currIndex = spotlightSequence.indexOf(prevId);
        const nextIndex = (currIndex + 1) % spotlightSequence.length;
        return spotlightSequence[nextIndex];
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoplay, spotlightSequence]);

  const getSpudImage = (spud: PotatoData) => {
    return spud.cropUrl || userImageUrl || DEFAULT_POTATOES[0].cropUrl!;
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
      {/* Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
        <Link href="/upload">
          <Button variant="outline" size="sm" className="gap-2 text-amber-950 border-amber-300 hover:bg-amber-100/80">
            <ArrowLeft className="w-4 h-4" />
            <span>Upload New Photo</span>
          </Button>
        </Link>

        <div className="flex flex-col items-end">
          <PotatoKudumbaUnitLogo size="sm" />
          <p className="text-xs font-bold text-amber-700 tracking-wider mt-1">
            VISION AI DRAMA ANALYTICS™ — RESULTS ({potatoes.length} SPUDS DETECTED)
          </p>
        </div>
      </div>

      {/* Top Best Potato Showcase Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 border-4 border-amber-300/40">
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-amber-200 shadow-xl shrink-0 bg-amber-900">
          <img
            src={getSpudImage(winnerPotato)}
            alt={winnerPotato.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-amber-900/10" />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 bg-amber-200/90 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full shadow-sm">
            <Trophy className="w-4 h-4 text-amber-700" />
            👑 Crowned #1 Most Dramatic Spud
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {winnerPotato.title} — {winnerPotato.persona}
          </h2>

          <p className="text-lg text-amber-100 font-bold italic">
            "{winnerPotato.malayalamQuote}"
          </p>

          <div className="pt-2">
            <span className="inline-block bg-black/20 text-amber-200 text-sm font-extrabold px-4 py-2 rounded-xl border border-white/10">
              Calculated Drama Score: {winnerPotato.dramaScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Spotlight Animation Section */}
      <div className="bg-amber-100/60 backdrop-blur-xl border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-amber-200 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <h3 className="text-xl font-extrabold text-amber-950">
              Spud Drama Spotlight™
            </h3>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="border-amber-300 text-amber-900 hover:bg-amber-200/60"
          >
            {isAutoplay ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
            {isAutoplay ? 'Pause' : 'Play Carousel'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Active Potato Dossier Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-amber-200/80 flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-56 h-56 rounded-xl overflow-hidden shadow-inner border border-amber-200 shrink-0 bg-amber-50">
              <img
                src={getSpudImage(activePotato)}
                alt={activePotato.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                  Object Telemetry Profile
                </span>
                <h4 className="text-2xl font-black text-amber-950">
                  {activePotato.title}
                </h4>
                <p className="text-sm font-bold text-amber-800">
                  {activePotato.persona}
                </p>
                <p className="text-sm text-slate-700 font-medium italic mt-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  "{activePotato.malayalamQuote}"
                </p>
              </div>

              <div className="space-y-2">
                <MetricBar label="Shape Irregularity" value={activePotato.irregularity} />
                <MetricBar label="Surface Roughness" value={activePotato.roughness} />
                <MetricBar label="Visual Uniqueness" value={activePotato.uniqueness} />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-extrabold text-slate-500">
                  Total Drama Score
                </span>
                <span className="text-2xl font-black text-amber-600">
                  {activePotato.dramaScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Selection Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-2">
              Detected Spuds ({potatoes.length})
            </h4>
            {potatoes.map((potato) => {
              const isActive = potato.id === activeId;

              return (
                <div
                  key={potato.id}
                  onClick={() => setActiveId(potato.id)}
                  className={`cursor-pointer transition-all duration-300 rounded-xl p-3 flex items-center gap-3 border ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-600 shadow-lg scale-105 ring-2 ring-amber-300'
                      : 'bg-white/80 text-amber-950 border-amber-200 hover:bg-amber-100/80 hover:border-amber-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-amber-800">
                    <img src={getSpudImage(potato)} alt={potato.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold truncate">
                      {potato.title}
                    </div>
                    <div className={`text-xs truncate ${isActive ? 'text-amber-100' : 'text-amber-800'}`}>
                      {potato.persona}
                    </div>
                  </div>

                  <div className={`text-sm font-black ${isActive ? 'text-white' : 'text-amber-600'}`}>
                    {potato.dramaScore}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/80 space-y-4">
        <h3 className="text-xl font-extrabold text-amber-950 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          <span>Multimodal AI Vision Leaderboard</span>
        </h3>

        <div className="rounded-2xl border border-amber-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-100/70 hover:bg-amber-100">
                <TableHead className="font-extrabold text-amber-950">Potato Segment</TableHead>
                <TableHead className="font-extrabold text-amber-950">Title / Personality</TableHead>
                <TableHead className="font-extrabold text-amber-950 text-center">Shape Irregularity</TableHead>
                <TableHead className="font-extrabold text-amber-950 text-center">Surface Roughness</TableHead>
                <TableHead className="font-extrabold text-amber-950 text-center">Visual Uniqueness</TableHead>
                <TableHead className="font-extrabold text-amber-950 text-right">Drama Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {potatoes.map((spud) => (
                <TableRow key={spud.id} className="hover:bg-amber-50/60 transition-colors">
                  <TableCell className="font-extrabold text-amber-950 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-amber-300 bg-amber-800">
                      <img src={getSpudImage(spud)} alt={spud.title} className="w-full h-full object-cover" />
                    </div>
                    {spud.title}
                  </TableCell>
                  <TableCell className="text-amber-900 font-bold">{spud.persona}</TableCell>
                  <TableCell className="text-center text-slate-700 font-medium">{spud.irregularity}/100</TableCell>
                  <TableCell className="text-center text-slate-700 font-medium">{spud.roughness}/100</TableCell>
                  <TableCell className="text-center text-slate-700 font-medium">{spud.uniqueness}/100</TableCell>
                  <TableCell className="text-right font-black text-amber-600 text-base">{spud.dramaScore}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Futuristic Quantum Portal Transition Screen */}
      <QuantumPortalTransition
        isTransitioning={isWarpingToCourt}
        spudCount={potatoes.length}
        onComplete={() => router.push('/court')}
      />

      {/* Courtroom Route Trigger Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-8 text-white shadow-xl text-center space-y-4 border-4 border-amber-600/40 relative overflow-hidden group">
        <div className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <h3 className="text-2xl sm:text-3xl font-black flex items-center justify-center gap-2">
          <span>Court of Potato Justice</span>
          <Gavel className="w-7 h-7 text-amber-300 animate-bounce" />
        </h3>
        <p className="text-amber-200 text-sm max-w-xl mx-auto font-medium">
          Pit your dynamically cropped spuds head-to-head in an interactive courtroom trial via Quantum Warp Teleportation.
        </p>
        <div>
          <Button
            size="lg"
            onClick={() => setIsWarpingToCourt(true)}
            className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-8 py-4 rounded-2xl text-base shadow-xl border-2 border-amber-200 gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <Zap className="w-5 h-5 text-amber-900 fill-amber-900 animate-pulse" />
            <span>ENGAGE QUANTUM WARP TO COURTROOM</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold text-slate-700">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
