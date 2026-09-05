'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button-1';

interface CardUploadProps {
  onFileSelect?: (file: File) => void;
}

export default function CardUpload({ onFileSelect }: CardUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleUseSample = () => {
    // Generate sample image blob
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(0, 0, 600, 400);
      
      // Draw potatoes
      const colors = ['#e2a85c', '#d29034', '#b87322'];
      [
        { x: 200, y: 200, rx: 70, ry: 50 },
        { x: 400, y: 180, rx: 80, ry: 60 },
        { x: 300, y: 300, rx: 65, ry: 45 }
      ].forEach((p, idx) => {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = colors[idx % colors.length];
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#92400e';
        ctx.stroke();
      });
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'sample_kizhangan_vault.jpg', { type: 'image/jpeg' });
        processFile(file);
      }
    });
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-8 transition-all text-center flex flex-col items-center justify-center cursor-pointer bg-white/80 backdrop-blur-md shadow-sm ${
          dragActive
            ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50/30'
            : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50/80'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {previewUrl ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md max-h-56">
              <img src={previewUrl} alt="Potato Preview" className="object-cover max-h-56 rounded-2xl" />
              <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <span>{selectedFile?.name}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
              <UploadCloud className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Drop Potato Vault Photo Here
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Supports JPG, PNG, WEBP high-resolution kitchen captures
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-semibold text-slate-400">OR</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseSample();
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5" /> Use Sample Spud Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
