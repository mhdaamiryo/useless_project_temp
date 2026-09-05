'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button-1';
import {
  Scale,
  Gavel,
  Shield,
  Swords,
  FileText,
  HelpCircle,
  BarChart3,
  ClipboardList,
  ArrowLeft,
  Settings,
  X,
  Trophy,
  Users,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface Spud {
  id: number;
  name: string;
  score: number;
  cropUrl?: string;
  persona?: string;
  malayalamQuote?: string;
  irregularity?: number;
  roughness?: number;
  uniqueness?: number;
}

const DEFAULT_SPUDS: Spud[] = [
  { id: 1, name: 'Potato #1', score: 60.7, persona: 'The Tragic Hero', cropUrl: '/judge_spud.png', irregularity: 60, roughness: 70, uniqueness: 65 },
  { id: 2, name: 'Potato #2', score: 69.8, persona: 'The Main Character', cropUrl: '/potato_prosecutor.png', irregularity: 75, roughness: 82, uniqueness: 88 },
];

interface ChatMessage {
  speaker: string;
  role: 'judge' | 'clerk' | 'defense' | 'prosecution';
  text: string;
  verdictType?: 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED';
}

export default function CourtRoomPage() {
  const [allSpuds, setAllSpuds] = useState<Spud[]>(DEFAULT_SPUDS);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [challengerId, setChallengerId] = useState<number>(1);
  const [opponentId, setOpponentId] = useState<number>(2);

  // Visual & Overlay States
  const [showEvidence, setShowEvidence] = useState(false);
  const [showLitigantSelect, setShowLitigantSelect] = useState(false);
  const [objectionAlert, setObjectionAlert] = useState<{ type: 'OBJECTION' | 'SUSTAINED' | 'OVERRULED' | 'PARTIAL' | null }>({ type: null });

  const [trialEnded, setTrialEnded] = useState(false);
  const [speakingRole, setSpeakingRole] = useState<'defense' | 'prosecution' | 'judge' | 'clerk' | null>(null);
  const [isStrikingGavel, setIsStrikingGavel] = useState(false);

  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    { speaker: 'JUDGE SPUD', role: 'judge', text: 'The court is now in session.' },
    { speaker: 'CLERK', role: 'clerk', text: 'All rise.' }
  ]);

  useEffect(() => {
    const storedData = sessionStorage.getItem('spud_analysis_data');
    const storedImg = sessionStorage.getItem('spud_image_url');

    if (storedImg) setUserImageUrl(storedImg);

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: Spud[] = parsed.map((item: any, idx: number) => ({
            id: item.id || idx + 1,
            name: item.title || `Potato #${item.id || idx + 1}`,
            score: typeof item.dramaScore === 'number' ? item.dramaScore : 60.0 + idx * 5,
            persona: item.persona || 'Courtroom Litigant',
            malayalamQuote: item.malayalamQuote,
            cropUrl: item.cropUrl || (idx === 1 ? '/potato_prosecutor.png' : '/judge_spud.png'),
            irregularity: item.irregularity || 55 + idx * 4,
            roughness: item.roughness || 60 + idx * 3,
            uniqueness: item.uniqueness || 50 + idx * 6,
          }));
          setAllSpuds(mapped);
          if (mapped.length > 1) {
            setChallengerId(mapped[0].id);
            setOpponentId(mapped[1].id);
          } else {
            setChallengerId(mapped[0].id);
            setOpponentId(mapped[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to parse dynamic spuds in court:', err);
      }
    }
  }, []);

  const challenger = allSpuds.find((s) => s.id === challengerId) || allSpuds[0];
  const opponent = allSpuds.find((s) => s.id === opponentId) || allSpuds[1] || allSpuds[0];

  const getSpudImg = (spud: Spud, defaultFallback: string) => {
    return spud.cropUrl || userImageUrl || defaultFallback;
  };

  const handleExecuteArgument = (type: string) => {
    if (trialEnded) return;

    if (type === 'IMMEDIATE_VERDICT') {
      triggerFinalVerdict();
      return;
    }

    let userMsg = '';
    let oppMsg = '';
    let judgeMsg = '';
    let alertType: 'SUSTAINED' | 'PARTIAL' | 'OVERRULED' = 'PARTIAL';

    if (type === 'DEFEND') {
      userMsg = `My client ${challenger.name} maintains that its high trauma score of ${challenger.score} reflects genuine emotional distress!`;
      oppMsg = `Objection! Trauma cannot be fabricated without verifiable surface irregularity!`;
      judgeMsg = `Objection noted. ALLEGATION ACCEPTED! Internal emotional distress factor recorded.`;
      alertType = 'SUSTAINED';
    } else if (type === 'ACCUSE') {
      userMsg = `I accuse ${opponent.name} of having an artificially inflated trauma index!`;
      oppMsg = `False! My surface roughness and cracks speak for themselves in this tribunal!`;
      judgeMsg = `ALLEGATION REJECTED! Visual evidence confirms the opponent's surface irregularity.`;
      alertType = 'OVERRULED';
    } else if (type === 'CHALLENGE') {
      userMsg = `The opponent's color distribution is surprisingly smooth and suspicious!`;
      oppMsg = `That is merely optimal lighting in this honorable courtroom!`;
      judgeMsg = `ALLEGATION ACCEPTED! Color stability weakness logged into the record.`;
      alertType = 'SUSTAINED';
    } else if (type === 'QUESTION') {
      userMsg = `We request clarification on how ${opponent.name} achieved a score of ${opponent.score}.`;
      oppMsg = `The numbers do not lie, counselor! Superior shape distortion wins cases.`;
      judgeMsg = `The court acknowledges both structural symmetry and character ruggedness.`;
      alertType = 'PARTIAL';
    }

    setSpeakingRole('defense');
    setObjectionAlert({ type: 'OBJECTION' });

    setTimeout(() => {
      setSpeakingRole('prosecution');
      setObjectionAlert({ type: null });
      setTimeout(() => {
        setSpeakingRole('judge');
        setObjectionAlert({ type: alertType });
        setTimeout(() => {
          setSpeakingRole(null);
          setObjectionAlert({ type: null });
        }, 1200);
      }, 1200);
    }, 1200);

    setChatLog((prev) => [
      ...prev,
      { speaker: `DEFENSE (${challenger.name})`, role: 'defense', text: userMsg },
      { speaker: `PROSECUTION (${opponent.name})`, role: 'prosecution', text: oppMsg },
      { speaker: 'JUDGE SPUD', role: 'judge', text: judgeMsg },
    ]);
  };

  const triggerFinalVerdict = () => {
    setIsStrikingGavel(true);
    setSpeakingRole('judge');

    setChatLog((prev) => [
      ...prev,
      { speaker: 'JUDGE SPUD', role: 'judge', text: 'SILENCE IN THE COURT! The evidence has been fully examined.' },
    ]);

    setTimeout(() => {
      setIsStrikingGavel(false);
      setTrialEnded(true);
      setSpeakingRole(null);
    }, 1500);
  };

  const winner = challenger.score >= opponent.score ? challenger : opponent;
  const loser = challenger.score < opponent.score ? challenger : opponent;

  return (
    <div className="min-h-screen bg-[#0f0905] text-amber-100 flex flex-col font-serif select-none overflow-x-hidden">

      {/* 1. TOP NAVBAR */}
      <header className="bg-[#160d07] border-b border-[#352212] px-4 sm:px-8 py-3 flex flex-wrap justify-between items-center z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/results" className="hover:opacity-80 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-400/80 hover:text-amber-300 hover:bg-[#28180d]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#dfb86c]" />
            <span className="font-serif font-black tracking-wider text-[#dfb86c] text-base sm:text-lg uppercase">
              POTATO COURT OF JUSTICE
            </span>
          </div>
          <span className="hidden md:inline text-[#7a6035] text-xs font-mono border-l border-[#352212] pl-3 ml-1 uppercase tracking-widest">
            CASE #POTATO-0186 • COMPARATIVE TRAUMA TRIBUNAL
          </span>
        </div>

        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button
            onClick={() => setShowLitigantSelect(true)}
            className="bg-[#c28424] hover:bg-[#d9972f] text-black font-extrabold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-md text-xs transition-all border border-[#f5b842] active:scale-95"
          >
            <Users className="w-3.5 h-3.5" />
            <span>SELECT SPUD LITIGANTS</span>
          </button>

          <div className="bg-[#100803] border border-[#422915] rounded px-3 py-1 text-[11px] text-[#dfb86c] tracking-widest font-mono flex items-center gap-2 shadow-inner">
            <span>COURT STATUS</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span>IN SESSION</span>
          </div>
          <span className="text-[10px] text-[#8c6f3e] tracking-widest font-mono uppercase hidden lg:inline">
            THE PEOPLE v. {challenger.name.toUpperCase()}
          </span>
        </div>
      </header>

      {/* QUICK LITIGANT SELECTOR BAR */}
      <section className="bg-[#1d1209] border-b border-[#3d2716] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-30">
        <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
          <Users className="w-4 h-4 text-[#c28424]" />
          <span>CHOOSE LITIGANTS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 flex-1 max-w-2xl justify-center sm:justify-end">
          {/* Defense Selector */}
          <div className="flex items-center gap-2 bg-[#120a04] border border-[#523720] rounded px-2.5 py-1">
            <span className="text-amber-500 font-bold text-[11px] uppercase">DEFENSE:</span>
            <select
              value={challengerId}
              onChange={(e) => setChallengerId(Number(e.target.value))}
              className="bg-transparent text-amber-100 font-bold text-xs outline-none cursor-pointer"
            >
              {allSpuds.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1a0f07] text-amber-100">
                  {s.name} ({s.score}% Trauma)
                </option>
              ))}
            </select>
          </div>

          <span className="text-amber-600 font-bold">VS</span>

          {/* Prosecution Selector */}
          <div className="flex items-center gap-2 bg-[#120a04] border border-[#523720] rounded px-2.5 py-1">
            <span className="text-amber-500 font-bold text-[11px] uppercase">PROSECUTION:</span>
            <select
              value={opponentId}
              onChange={(e) => setOpponentId(Number(e.target.value))}
              className="bg-transparent text-amber-100 font-bold text-xs outline-none cursor-pointer"
            >
              {allSpuds.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1a0f07] text-amber-100">
                  {s.name} ({s.score}% Trauma)
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 2. MAIN COURTROOM ARENA STAGE */}
      <main className="relative w-full flex-1 min-h-[460px] sm:min-h-[520px] bg-[#1a0e06] overflow-hidden flex flex-col justify-between border-b-2 border-[#382312]">
        
        {/* Background Image / Render */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: `url('/courtroom_bg.png')` }}
        />
        <div className="absolute inset-0 bg-radial-vignette bg-gradient-to-t from-[#100803] via-transparent to-[#160c06]/80 pointer-events-none" />

        {/* Floating Objection Overlay Banner */}
        {objectionAlert.type && !trialEnded && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className={`text-3xl sm:text-5xl font-black uppercase italic drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] animate-in zoom-in-50 duration-200 tracking-wider ${
              objectionAlert.type === 'OBJECTION' ? 'text-red-500' :
              objectionAlert.type === 'SUSTAINED' ? 'text-emerald-400' :
              objectionAlert.type === 'OVERRULED' ? 'text-red-600' : 'text-amber-400'
            }`}>
              {objectionAlert.type === 'OBJECTION' ? '⚠️ OBJECTION!' :
               objectionAlert.type === 'SUSTAINED' ? '✓ OBJECTION SUSTAINED' :
               objectionAlert.type === 'OVERRULED' ? '✕ OBJECTION OVERRULED' :
               '△ PARTIALLY SUSTAINED'}
            </div>
          </div>
        )}

        {/* TOP CENTER: JUDGE BENCH */}
        <div className="relative z-10 w-full flex justify-center pt-4">
          <div className="flex flex-col items-center">
            
            {/* Header Crest Banner above Judge */}
            <div className="bg-[#2a1a0f] border border-[#523720] rounded px-4 py-0.5 text-[10px] font-mono tracking-widest text-[#dfb86c] shadow-md uppercase mb-1">
              COURT OF POTATO JUSTICE
            </div>

            {/* Judge Avatar & Wig Frame */}
            <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#8c5a2b] bg-[#160d07] shadow-2xl overflow-hidden transition-all duration-300 ${
              speakingRole === 'judge' ? 'ring-4 ring-amber-400 scale-105 shadow-[0_0_35px_rgba(223,184,108,0.4)]' : ''
            }`}>
              <img
                src="/judge_spud.png"
                alt="Judge Spud"
                className="w-full h-full object-cover object-top scale-110"
              />
            </div>

            {/* Judge Desk Structure */}
            <div className="relative -mt-6 bg-gradient-to-b from-[#482c16] to-[#28170b] border-t-4 border-[#7a4c25] border-x-2 border-x-[#382211] w-64 sm:w-80 px-4 py-2 rounded-t-sm shadow-2xl flex flex-col items-center">
              <div className="bg-[#120a04] border border-[#54381e] px-4 py-1 rounded text-center shadow-inner">
                <div className="text-[11px] font-serif font-bold text-[#e5c158] tracking-wider uppercase">
                  THE HONORABLE JUDGE SPUD
                </div>
              </div>

              {/* Gavel Hammer Animation */}
              <div className={`absolute right-4 top-1 text-3xl transition-transform duration-150 origin-bottom-right ${
                isStrikingGavel ? '-rotate-45 scale-125 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'rotate-12'
              }`}>
                🔨
              </div>
            </div>
          </div>
        </div>

        {/* MID-LOWER LEVEL: DEFENSE (LEFT) AND PROSECUTION (RIGHT) */}
        <div className="relative z-20 flex justify-between items-end px-4 sm:px-16 pb-3 mt-auto">
          
          {/* DEFENSE PODIUM (LEFT) */}
          <div className="flex flex-col items-center">
            <div className="bg-[#2c1a0e]/95 border border-[#5c3a1e] rounded-lg p-3 sm:p-4 shadow-2xl w-44 sm:w-60 text-center backdrop-blur-sm relative flex flex-col items-center">
              <div className="text-[10px] font-mono tracking-widest text-[#dfb86c] uppercase mb-1">
                DEFENSE
              </div>

              {/* Defense Potato Avatar with Sticky Note */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2">
                <div className={`w-full h-full rounded-full border-3 border-[#8c5a2b] overflow-hidden bg-[#160d07] shadow-inner transition-all duration-300 ${
                  speakingRole === 'defense' ? 'ring-4 ring-amber-400 scale-105' : ''
                }`}>
                  <img
                    src={getSpudImg(challenger, '/judge_spud.png')}
                    alt={challenger.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Yellow Sticky Note Badge */}
                <div className="absolute -bottom-1 -right-1 bg-[#f7e492] text-[#4a3a0a] text-[10px] font-black p-1 rounded shadow-md border border-[#d6be65] rotate-6">
                  📌 EVIDENCE
                </div>
              </div>

              {/* Direct Potato Selector Dropdown on Defense Podium */}
              <div className="w-full text-left mt-1">
                <label className="block text-[9px] font-mono text-amber-400/90 uppercase mb-0.5">
                  DEFENSE SPUD:
                </label>
                <select
                  value={challengerId}
                  onChange={(e) => setChallengerId(Number(e.target.value))}
                  className="w-full bg-[#120a04] border border-[#6b4522] rounded px-2 py-1 text-xs font-serif font-bold text-amber-100 outline-none cursor-pointer hover:border-amber-400 transition-colors"
                >
                  {allSpuds.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#1a0f07] text-amber-100">
                      {s.name} ({s.score}% Trauma)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs font-mono text-[#a6864d] mt-1">
                TRAUMA SCORE: <span className="text-amber-200 font-bold">{challenger.score}</span>
              </div>
            </div>
          </div>

          {/* PROSECUTION PODIUM (RIGHT) */}
          <div className="flex flex-col items-center">
            <div className="bg-[#2c1a0e]/95 border border-[#5c3a1e] rounded-lg p-3 sm:p-4 shadow-2xl w-44 sm:w-60 text-center backdrop-blur-sm relative flex flex-col items-center">
              <div className="text-[10px] font-mono tracking-widest text-[#dfb86c] uppercase mb-1">
                PROSECUTION
              </div>

              {/* Prosecution Potato Avatar with Sticky Note */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2">
                <div className={`w-full h-full rounded-full border-3 border-[#8c5a2b] overflow-hidden bg-[#160d07] shadow-inner transition-all duration-300 ${
                  speakingRole === 'prosecution' ? 'ring-4 ring-amber-400 scale-105' : ''
                }`}>
                  <img
                    src={getSpudImg(opponent, '/potato_prosecutor.png')}
                    alt={opponent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Yellow Sticky Note Badge */}
                <div className="absolute -bottom-1 -right-1 bg-[#f7e492] text-[#4a3a0a] text-[10px] font-black p-1 rounded shadow-md border border-[#d6be65] -rotate-6">
                  📌 EXHIBIT
                </div>
              </div>

              {/* Direct Potato Selector Dropdown on Prosecution Podium */}
              <div className="w-full text-left mt-1">
                <label className="block text-[9px] font-mono text-amber-400/90 uppercase mb-0.5">
                  PROSECUTION SPUD:
                </label>
                <select
                  value={opponentId}
                  onChange={(e) => setOpponentId(Number(e.target.value))}
                  className="w-full bg-[#120a04] border border-[#6b4522] rounded px-2 py-1 text-xs font-serif font-bold text-amber-100 outline-none cursor-pointer hover:border-amber-400 transition-colors"
                >
                  {allSpuds.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#1a0f07] text-amber-100">
                      {s.name} ({s.score}% Trauma)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs font-mono text-[#a6864d] mt-1">
                TRAUMA SCORE: <span className="text-amber-200 font-bold">{opponent.score}</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 3. ACTION BUTTONS TOOLBAR */}
      <section className="bg-[#180e07] border-y border-[#382312] p-3 px-4 sm:px-8 z-30">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          
          <button
            onClick={() => handleExecuteArgument('DEFEND')}
            disabled={trialEnded || speakingRole !== null}
            className="bg-[#24170d] hover:bg-[#342213] border border-[#523720] text-[#dfb86c] rounded px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Shield className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>DEFEND MY POTATO</span>
          </button>

          <button
            onClick={() => handleExecuteArgument('ACCUSE')}
            disabled={trialEnded || speakingRole !== null}
            className="bg-[#24170d] hover:bg-[#342213] border border-[#523720] text-[#dfb86c] rounded px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Swords className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>ACCUSE OPPONENT</span>
          </button>

          <button
            onClick={() => setShowEvidence(true)}
            disabled={trialEnded}
            className="bg-[#24170d] hover:bg-[#342213] border border-[#523720] text-[#dfb86c] rounded px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>PRESENT EVIDENCE</span>
          </button>

          <button
            onClick={() => handleExecuteArgument('CHALLENGE')}
            disabled={trialEnded || speakingRole !== null}
            className="bg-[#24170d] hover:bg-[#342213] border border-[#523720] text-[#dfb86c] rounded px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Scale className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>CHALLENGE SCORE</span>
          </button>

          <button
            onClick={() => handleExecuteArgument('QUESTION')}
            disabled={trialEnded || speakingRole !== null}
            className="bg-[#24170d] hover:bg-[#342213] border border-[#523720] text-[#dfb86c] rounded px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>QUESTION RANKING</span>
          </button>

          <button
            onClick={() => handleExecuteArgument('IMMEDIATE_VERDICT')}
            disabled={trialEnded || speakingRole !== null}
            className="bg-[#c28424] hover:bg-[#d9972f] text-black font-black rounded px-4 py-2 text-xs flex items-center gap-2 transition-all shadow-lg border border-[#f5b842] active:scale-95 disabled:opacity-50"
          >
            <Gavel className="w-3.5 h-3.5 text-black" />
            <span>REQUEST VERDICT</span>
          </button>

        </div>
      </section>

      {/* 4. BOTTOM DASHBOARD (3 CARDS) */}
      <footer className="bg-[#120a04] p-4 sm:p-6 z-30 border-t border-[#26160a]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* CARD 1: CASE OVERVIEW (~3 cols) */}
          <div className="md:col-span-3 bg-[#1a0f07] border border-[#382312] rounded-lg p-4 shadow-lg flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#dfb86c] font-serif font-bold text-xs uppercase tracking-wider mb-3 border-b border-[#382312] pb-2">
              <ClipboardList className="w-4 h-4 text-[#dfb86c]" />
              <span>CASE OVERVIEW</span>
            </div>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#8c6f3e]">Case ID:</span>
                <span className="text-amber-100 font-bold">POTATO-0186</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c6f3e]">Tribunal:</span>
                <span className="text-amber-100 text-[11px] text-right font-semibold">Comparative Trauma</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c6f3e]">Status:</span>
                <span className="text-emerald-400 font-bold">In Session</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c6f3e]">Judge:</span>
                <span className="text-amber-100 text-[11px] text-right font-semibold">Hon. Judge Spud</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c6f3e]">Filed:</span>
                <span className="text-amber-100 font-mono">July 21, 2025</span>
              </div>
            </div>
          </div>

          {/* CARD 2: COURT TRANSCRIPT (~5 cols) */}
          <div className="md:col-span-5 bg-[#1a0f07] border border-[#382312] rounded-lg p-4 shadow-lg flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#dfb86c] font-serif font-bold text-xs uppercase tracking-wider mb-3 border-b border-[#382312] pb-2">
              <Gavel className="w-4 h-4 text-[#dfb86c]" />
              <span>COURT TRANSCRIPT</span>
            </div>

            <div className="bg-[#0c0704] border border-[#2b1b0e] rounded p-3 h-36 overflow-y-auto space-y-2.5 font-mono text-xs text-amber-100/90 shadow-inner">
              {chatLog.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#24160c] border border-[#523720] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {msg.role === 'judge' ? '👨‍⚖️' : msg.role === 'defense' ? '🥔' : msg.role === 'prosecution' ? '🥔' : '📜'}
                  </div>
                  <div>
                    <span className={`font-bold uppercase text-[11px] tracking-wider ${
                      msg.role === 'judge' ? 'text-amber-400' :
                      msg.role === 'defense' ? 'text-amber-200' :
                      msg.role === 'prosecution' ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {msg.speaker}:
                    </span>{' '}
                    <span className="text-amber-100/90 italic">"{msg.text}"</span>
                  </div>
                </div>
              ))}
              <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          </div>

          {/* CARD 3: SCORE COMPARISON (~4 cols) */}
          <div className="md:col-span-4 bg-[#1a0f07] border border-[#382312] rounded-lg p-4 shadow-lg flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#dfb86c] font-serif font-bold text-xs uppercase tracking-wider mb-3 border-b border-[#382312] pb-2">
              <BarChart3 className="w-4 h-4 text-[#dfb86c]" />
              <span>SCORE COMPARISON</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              
              {/* Defense Score */}
              <div className="flex-1 text-center">
                <div className="text-[11px] text-[#8c6f3e] font-serif mb-1">
                  {challenger.name} (Defense)
                </div>
                <div className="text-2xl font-serif font-black text-amber-100">
                  {challenger.score}
                </div>
                <div className="w-full bg-[#2a1a0f] h-2 rounded-full mt-2 overflow-hidden border border-[#4a301b]">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, challenger.score)}%` }}
                  />
                </div>
              </div>

              {/* VS Badge */}
              <div className="w-8 h-8 rounded-full bg-[#180e07] border border-[#523720] flex items-center justify-center text-[10px] font-bold text-[#dfb86c] shadow-lg flex-shrink-0">
                VS
              </div>

              {/* Prosecution Score */}
              <div className="flex-1 text-center">
                <div className="text-[11px] text-[#8c6f3e] font-serif mb-1">
                  {opponent.name} (Prosecution)
                </div>
                <div className="text-2xl font-serif font-black text-amber-100">
                  {opponent.score}
                </div>
                <div className="w-full bg-[#2a1a0f] h-2 rounded-full mt-2 overflow-hidden border border-[#4a301b]">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, opponent.score)}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </footer>

      {/* MODAL 1: PRESENT EVIDENCE OVERLAY */}
      {showEvidence && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#f4e4bc] text-[#3a2313] w-full max-w-lg rounded-md shadow-2xl border-4 border-[#8c5a2b] p-6 font-mono relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowEvidence(false)}
              className="absolute top-3 right-3 text-xl font-bold text-[#5c3a1e] hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b-2 border-[#3a2313] pb-3 mb-4 text-center">
              <h3 className="text-lg font-black uppercase tracking-widest text-[#3a2313]">
                📁 EXHIBIT A — SPUD METRICS EVIDENCE
              </h3>
              <p className="text-xs text-[#6e4d2e]">COMPARATIVE TRAUMA BREAKDOWN</p>
            </div>

            <div className="space-y-4">
              {/* Plaintiff / Defense Stats */}
              <div className="bg-[#ebd4a2] p-3 rounded border border-[#cfa968]">
                <h4 className="font-bold text-xs uppercase underline mb-2 text-[#3a2313]">
                  PLAINTIFF ({challenger.name})
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>IRREGULARITY:</span>
                    <span>{challenger.irregularity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SURFACE COMPLEXITY:</span>
                    <span>{challenger.roughness}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VISUAL UNIQUENESS:</span>
                    <span>{challenger.uniqueness}%</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-[#3a2313]/20 pt-1 mt-1">
                    <span>TOTAL TRAUMA SCORE:</span>
                    <span>{challenger.score}</span>
                  </div>
                </div>
              </div>

              {/* Defendant / Prosecution Stats */}
              <div className="bg-[#ebd4a2] p-3 rounded border border-[#cfa968]">
                <h4 className="font-bold text-xs uppercase underline mb-2 text-[#3a2313]">
                  DEFENDANT ({opponent.name})
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>IRREGULARITY:</span>
                    <span>{opponent.irregularity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SURFACE COMPLEXITY:</span>
                    <span>{opponent.roughness}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VISUAL UNIQUENESS:</span>
                    <span>{opponent.uniqueness}%</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-[#3a2313]/20 pt-1 mt-1">
                    <span>TOTAL TRAUMA SCORE:</span>
                    <span>{opponent.score}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LITIGANT SELECTION OVERLAY */}
      {showLitigantSelect && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f07] border-2 border-[#523720] rounded-xl p-6 max-w-md w-full text-amber-100 space-y-4 relative">
            <button
              onClick={() => setShowLitigantSelect(false)}
              className="absolute top-4 right-4 text-amber-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-serif font-black text-[#dfb86c] text-center uppercase tracking-wider">
              SELECT COURTROOM LITIGANTS
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a6864d] font-mono mb-1 uppercase">
                  Defense Potato (Plaintiff)
                </label>
                <select
                  value={challengerId}
                  onChange={(e) => setChallengerId(Number(e.target.value))}
                  className="w-full bg-[#0c0704] border border-[#523720] rounded p-2 text-amber-100 font-mono text-xs outline-none"
                >
                  {allSpuds.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Trauma {s.score}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#a6864d] font-mono mb-1 uppercase">
                  Prosecution Potato (Defendant)
                </label>
                <select
                  value={opponentId}
                  onChange={(e) => setOpponentId(Number(e.target.value))}
                  className="w-full bg-[#0c0704] border border-[#523720] rounded p-2 text-amber-100 font-mono text-xs outline-none"
                >
                  {allSpuds.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Trauma {s.score}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={() => setShowLitigantSelect(false)}
              className="w-full bg-[#c28424] hover:bg-[#d9972f] text-black font-bold text-xs py-2 rounded"
            >
              CONFIRM LITIGANTS
            </Button>
          </div>
        </div>
      )}

      {/* MODAL 3: FINAL VERDICT OVERLAY */}
      {trialEnded && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-gradient-to-b from-[#24160c] to-[#120904] border-2 border-[#c28424] p-6 sm:p-10 text-center rounded-xl shadow-[0_0_80px_rgba(194,132,36,0.3)] max-w-xl w-full relative">
            <div className="text-[#dfb86c] text-sm font-mono tracking-widest uppercase mb-2 flex items-center justify-center gap-2">
              <Scale className="w-4 h-4 text-[#c28424]" />
              <span>OFFICIAL COURT VERDICT</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100 mb-6 tracking-wide">
              THE POTATO COURT FINDS...
            </h2>

            <div className="bg-[#0c0603] border border-[#482d19] p-5 rounded-lg mb-6">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="text-2xl font-serif font-black text-[#f5b842] mb-1">
                {winner.name} PREVAILS!
              </h3>
              <p className="text-xs text-[#a6864d] italic font-serif mb-4">
                "{winner.persona}"
              </p>

              <div className="flex justify-center items-center gap-6 font-mono text-xs border-y border-[#352212] py-3 mb-4">
                <div>
                  <div className="text-[#8c6f3e] text-[10px]">DEFENSE</div>
                  <div className="text-lg font-bold text-amber-200">{challenger.score}</div>
                </div>
                <div className="text-[#c28424] font-bold">VS</div>
                <div>
                  <div className="text-[#8c6f3e] text-[10px]">PROSECUTION</div>
                  <div className="text-lg font-bold text-amber-200">{opponent.score}</div>
                </div>
              </div>

              <div className="text-xs font-serif text-amber-100/90 leading-relaxed text-left bg-[#1a0f07] p-3 rounded border-l-2 border-[#c28424]">
                "After careful examination of shape irregularity, surface complexity, and emotional trauma metrics, the court hereby awards victory to {winner.name}. The potato justice system has spoken."
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setTrialEnded(false)}
                className="flex-1 bg-[#24160c] hover:bg-[#342213] border border-[#523720] text-amber-200 font-mono text-xs py-2.5 rounded transition-all"
              >
                REOPEN CASE
              </button>
              <Link href="/results" className="flex-1">
                <button className="w-full bg-[#c28424] hover:bg-[#d9972f] text-black font-bold text-xs py-2.5 rounded transition-all shadow-lg">
                  RETURN TO RESULTS
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
