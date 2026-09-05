'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CardUpload from '@/components/ui/file-upload-card';
import { Button } from '@/components/ui/button-1';
import PotatoKudumbaUnitLogo from '@/components/logo';
import { detectPotatoesFromCanvas } from '@/lib/potato-cv';
import { ArrowLeft, Sparkles, Cpu, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageBase64(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartScan = async () => {
    if (!imageBase64) {
      alert('Please upload or select a potato image first!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('🔍 Running HTML5 Pixel CV: Detecting potato count & shape contours...');

    try {
      setAnalysisStep(`🎭 Initializing Vision AI Pipeline: Running DETR / YOLO Inference...`);

      await new Promise((r) => setTimeout(r, 800));
      setAnalysisStep(`⚖️ Consulting POTATO KUDUMBA UNIT (കിഴങ്ങൻ കുടുംബ യൂണിറ്റ്) Tribunal...`);

      // Step 2: Call Vision AI API Route with Client Blobs Metadata
      const response = await fetch('/api/analyze-potatoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await response.json();

      if (data.potatoes && Array.isArray(data.potatoes)) {
        // Server already returns individual cropUrl per potato (via sharp)
        // Just store the data directly
        sessionStorage.setItem('spud_image_url', imageBase64);
        sessionStorage.setItem('spud_analysis_data', JSON.stringify(data.potatoes));

        setTimeout(() => {
          router.push('/results');
        }, 400);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
      alert('Failed to analyze potato image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col justify-between">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-6 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-700 hover:text-amber-800">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
        <PotatoKudumbaUnitLogo size="sm" />
      </div>

      {/* Main Upload Card Wrapper */}
      <div className="bg-white/90 backdrop-blur-xl border-2 border-amber-200 rounded-3xl p-8 shadow-xl shadow-amber-500/5 my-auto relative overflow-hidden">
        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in">
            <div className="w-20 h-20 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-6 flex items-center justify-center text-3xl">
              🥔
            </div>
            <h3 className="text-2xl font-black mb-2 text-amber-300">
              PIXEL CV & VISION ANALYSIS IN PROGRESS
            </h3>
            <p className="text-sm font-bold text-amber-100 max-w-md animate-pulse">
              {analysisStep}
            </p>
          </div>
        )}

        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <PotatoKudumbaUnitLogo size="md" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-2">
            Upload Potato Vault Photo
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Upload a clear photo containing one or more potatoes to run real pixel count detection and shape contour analysis.
          </p>
        </div>

        {/* CardUpload Component Integrated */}
        <CardUpload onFileSelect={handleFileSelect} />

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleStartScan}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-10 gap-3 text-base shadow-xl bg-amber-500 hover:bg-amber-600 text-white font-black"
          >
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-200" />
            )}
            <span>Analyze Spud Drama</span>
          </Button>
        </div>

        {/* Telemetry Status Indicator */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>HTML5 Pixel Computer Vision Engine: Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ready for Ingestion
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs font-medium text-slate-400 mt-8">
        POTATO KUDUMBA UNIT (കിഴങ്ങൻ കുടുംബ യൂണിറ്റ്) • Root Vegetable Trauma Intelligence v4.2
      </div>
    </div>
  );
}
