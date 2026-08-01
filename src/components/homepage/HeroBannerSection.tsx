import React, { useState, useEffect } from 'react';
import { HeroBannerConfig } from '../../types';
import { useStore } from '../../store';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeaturedCollections } from '../HomeSections';

interface HeroBannerSectionProps {
  config?: HeroBannerConfig;
}

export const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({ config }) => {
  const { navigate } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides = config?.slides && config.slides.length > 0 ? config.slides : null;

  useEffect(() => {
    if (!slides || slides.length <= 1 || config?.autoRotate === false) return;
    const interval = (config?.rotationInterval || 6) * 1000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides, config?.autoRotate, config?.rotationInterval]);

  if (!slides || slides.length === 0) {
    // Render default curated collections hero banner
    return <FeaturedCollections />;
  }

  const slide = slides[currentSlideIndex] as any;
  const image = slide.desktopImage || slide.imageUrl || slide.image;
  const headline = slide.headline || slide.title;
  const subheadline = slide.subheadline || slide.subtitle;
  const buttonText = slide.buttonText || slide.ctaText;
  const buttonUrl = slide.buttonUrl || slide.ctaUrl;

  return (
    <section className="relative w-full overflow-hidden bg-ink-950 text-white min-h-[500px] sm:min-h-[620px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {image && (
          <img
            src={image}
            alt={headline || 'Hero slide'}
            className="w-full h-full object-cover object-center transition-all duration-700 scale-105"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,${(slide.overlayOpacity ?? 50) / 100}), transparent)`
          }}
        />
      </div>

      {/* Content */}
      <div className="container-lux relative z-10 py-16 sm:py-24">
        <div className="max-w-xl space-y-4 animate-fade-in">
          {subheadline && (
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
              {subheadline}
            </span>
          )}
          {headline && (
            <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight text-white drop-shadow-md">
              {headline}
            </h1>
          )}
          {buttonText && (
            <div className="pt-4">
              <button
                onClick={() => {
                  const link = buttonUrl?.trim() || 'shop';
                  if (link.startsWith('http')) {
                    window.open(link, '_blank');
                  } else {
                    navigate({ name: 'shop' });
                  }
                }}
                className="btn-gold flex items-center gap-2 shadow-xl"
              >
                {buttonText} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide Navigation Arrows */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="p-2 rounded-full glass hover:bg-white/30 text-white transition"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-mono font-medium px-2">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            className="p-2 rounded-full glass hover:bg-white/30 text-white transition"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
};
