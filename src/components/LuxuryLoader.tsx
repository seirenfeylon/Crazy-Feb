import { useState, useEffect } from 'react';

const DEFAULT_LUXURY_MESSAGES = [
  'Preparing your experience...',
  'Curating luxury...',
  'Crafting elegance...',
  'Loading the collection...',
  'Almost ready...',
];

interface LuxuryLoaderProps {
  show?: boolean;
  message?: string;
  fullScreen?: boolean;
}

export default function LuxuryLoader({
  show = true,
  message,
  fullScreen = true,
}: LuxuryLoaderProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(show);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsFadingOut(false);
    } else {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsFadingOut(false);
      }, 500); // 500ms smooth fade out
      return () => clearTimeout(timer);
    }
  }, [show]);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % DEFAULT_LUXURY_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [message]);

  if (!isVisible) return null;

  const currentMessage = message || DEFAULT_LUXURY_MESSAGES[msgIdx];

  const containerClasses = fullScreen
    ? `fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`
    : `relative flex h-72 w-full flex-col items-center justify-center rounded-3xl bg-ink-900/90 backdrop-blur-xl border border-white/10 p-8 text-white transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading CrazyFeb Atelier"
      className={containerClasses}
    >
      {/* Soft Ambient Radial Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[110px]" />
      </div>

      {/* Minimal Particle Shimmer Highlights */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="absolute -top-12 left-1/3 h-1.5 w-1.5 rounded-full bg-gold-300/40 animate-particle-shimmer" />
        <span className="absolute top-1/4 right-1/3 h-1 w-1 rounded-full bg-gold-200/50 animate-particle-shimmer delay-300" />
        <span className="absolute bottom-1/3 left-1/4 h-1 w-1 rounded-full bg-gold-400/40 animate-particle-shimmer delay-700" />
      </div>

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4">
        {/* Animated Brand Emblem & Light Sweep Container */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 p-5 shadow-2xl border border-gold-400/20 backdrop-blur-md animate-luxury-breath">
            {/* Gold Logo */}
            <img
              src="/branding/logo-gold.svg"
              alt="CrazyFeb Atelier Logo"
              className="h-10 sm:h-12 w-auto object-contain select-none"
            />
            {/* Light Sweep Sheen Line across logo */}
            <div className="pointer-events-none absolute inset-0 -top-4 -left-12 h-24 w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-light-sweep" />
          </div>
        </div>

        {/* Thin Gold Progress Indicator Line */}
        <div className="relative mb-6 h-[1.5px] w-40 overflow-hidden rounded-full bg-white/15">
          <div className="absolute inset-y-0 w-24 rounded-full bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-luxury-line" />
        </div>

        {/* Rotating Luxury Message with Fade Animation */}
        <p
          key={currentMessage}
          className="font-display text-sm sm:text-base font-light tracking-widest text-ink-100 animate-fadeIn uppercase"
        >
          {currentMessage}
        </p>

        {/* Subtitle / Brand Signature */}
        <div className="mt-5 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-400/80">
          <span>CrazyFeb</span>
          <span className="inline-block h-1 w-1 rounded-full bg-gold-400" />
          <span>Haute Couture</span>
        </div>
      </div>
    </div>
  );
}
