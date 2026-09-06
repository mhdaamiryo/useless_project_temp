import './globals.css';
import BackgroundParticles from '@/components/background-particles';
import MouseSpotlight from '@/components/mouse-spotlight';
import Auralis from '@/components/ui/auralis';
import { Noto_Sans_Malayalam, Inter, Caveat } from 'next/font/google';

const notoSansMalayalam = Noto_Sans_Malayalam({
  weight: ['400', '600', '700', '800'],
  subsets: ['malayalam'],
  variable: '--font-malayalam',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
});

export const metadata = {
  title: 'POTATO KUDUMBA UNIT (കിഴങ്ങൻ കുടുംബ യൂണിറ്റ്) | Advanced Spud Intelligence',
  description: 'Advanced Emotional Intelligence & Trauma Telemetry for Root Vegetables',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSansMalayalam.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="bg-slate-50 text-slate-900 min-h-screen relative font-sans antialiased selection:bg-amber-200 overflow-x-hidden">
        <Auralis
          colors={["#d97706", "#b45309", "#78350f"]}
          speed={0.25}
          grain={0.4}
          height="100vh"
          className="fixed inset-0 w-full h-full pointer-events-none -z-20 opacity-40"
        />
        <BackgroundParticles />
        <MouseSpotlight />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
