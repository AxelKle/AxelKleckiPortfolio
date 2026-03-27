'use client';

import { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useProject } from '@/context/ProjectContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface ProjectItem {
  slug: string;
  title: string;
  company: string;
  role: string;
  shortDesc: string;
  cover?: string;
}

const FEATURED_GAP_PX = 12;

function useFeaturedVisibleCols() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setCols(mq.matches ? 3 : 1);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return cols;
}

export function LandingPage() {
  const [input, setInput] = useState('');
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([]);
  const [featuredStart, setFeaturedStart] = useState(0);
  const [slideLayout, setSlideLayout] = useState({ offsetPx: 0, cardWidthPx: 0 });
  const featuredViewportRef = useRef<HTMLDivElement>(null);
  const visibleFeaturedCols = useFeaturedVisibleCols();
  const { enterChatView } = useApp();
  const { openProject } = useProject();
  const { t, locale } = useLanguage();

  useEffect(() => {
    fetch(`/api/projects?locale=${locale}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: ProjectItem[]) => setFeaturedProjects(data))
      .catch(() => setFeaturedProjects([]));
  }, [locale]);

  useEffect(() => {
    setFeaturedStart(0);
  }, [featuredProjects]);

  const featuredMaxStart = Math.max(
    0,
    featuredProjects.length - visibleFeaturedCols
  );
  const showFeaturedArrows = featuredProjects.length > visibleFeaturedCols;

  useEffect(() => {
    setFeaturedStart((s) => Math.min(s, featuredMaxStart));
  }, [featuredMaxStart]);

  useLayoutEffect(() => {
    const el = featuredViewportRef.current;
    if (!el || !showFeaturedArrows) {
      setSlideLayout({ offsetPx: 0, cardWidthPx: 0 });
      return;
    }
    const measure = () => {
      const cs = getComputedStyle(el);
      const padX =
        (parseFloat(cs.paddingLeft) || 0) +
        (parseFloat(cs.paddingRight) || 0);
      const w = el.clientWidth - padX;
      const cols = visibleFeaturedCols;
      const cardWidthPx =
        cols > 0 ? (w - (cols - 1) * FEATURED_GAP_PX) / cols : w;
      setSlideLayout({
        offsetPx: featuredStart * (cardWidthPx + FEATURED_GAP_PX),
        cardWidthPx,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [
    featuredStart,
    showFeaturedArrows,
    visibleFeaturedCols,
    featuredProjects.length,
  ]);

  const goFeaturedPrev = useCallback(() => {
    setFeaturedStart((s) => (s <= 0 ? featuredMaxStart : s - 1));
  }, [featuredMaxStart]);

  const goFeaturedNext = useCallback(() => {
    setFeaturedStart((s) => (s >= featuredMaxStart ? 0 : s + 1));
  }, [featuredMaxStart]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) {
      enterChatView(trimmed);
    }
  };

  const handleSuggestionClick = (question: string) => {
    enterChatView(question);
  };

  const openFeaturedProject = (p: ProjectItem) => {
    openProject(p.slug);
  };

  const featuredCard = (p: ProjectItem) => (
    <button
      key={p.slug}
      type="button"
      onClick={() => openFeaturedProject(p)}
      className="featured-project-card"
      style={
        showFeaturedArrows && slideLayout.cardWidthPx > 0
          ? {
              width: slideLayout.cardWidthPx,
              minWidth: slideLayout.cardWidthPx,
            }
          : undefined
      }
    >
      <div className="featured-card-image-wrap">
        {p.cover ? (
          <Image
            src={p.cover}
            alt={p.title}
            fill
            className="object-cover"
            style={{ objectPosition: 'top center' }}
            sizes="(max-width: 767px) 100vw, 292px"
          />
        ) : (
          <div className="w-full h-full bg-[#E8E4DC]" />
        )}
      </div>
      <div className="featured-card-text">
        <h3 className="featured-card-title">{p.title}</h3>
        <p className="featured-card-desc">{p.shortDesc}</p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-warm">
      {/* Floating language switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Main content */}
      <main className="landing-main relative flex-1 flex flex-col items-center pb-10 px-6 pt-[60px] md:pt-[80px]">
        {/* Background orbs */}
        <div className="landing-bg-fx" aria-hidden>
          <div className="landing-orb landing-orb-1" />
          <div className="landing-orb landing-orb-2" />
          <div className="landing-orb landing-orb-3" />
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center relative">
        {/* Headline - key forces re-render when locale changes */}
        <h1 key={locale} className="landing-headline text-center w-full hero-anim-1">
          <span className="block">{t.headline}</span>
          <span className="text-grad">{t.headlineHighlight}</span>
        </h1>
        <p className="landing-subtitle text-center w-full hero-anim-2">
          {t.subtitle}
        </p>

        {/* Search bar */}
        <div className="landing-search-wrap w-full hero-anim-3" style={{ marginTop: '48px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t.searchPlaceholder}
            className="landing-search-input"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="landing-search-btn"
          >
            <Search className="size-5" />
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 w-full justify-center hero-anim-4" style={{ marginTop: '12px' }}>
          {t.suggestedQuestions.slice(0, 3).map((q) => (
            <button
              key={q}
              onClick={() => handleSuggestionClick(q)}
              className="suggestion-btn"
            >
              {q}
            </button>
          ))}
        </div>
        </div>

        {/* Featured projects: full main width so nav sits outside the card strip */}
        {featuredProjects.length > 0 && (
        <section
          className={`featured-projects-section featured-projects-section--landing w-full mx-auto relative${showFeaturedArrows ? ' featured-projects-section--landing-wide' : ''}`}
        >
          <h2 className="featured-projects-label">{t.featuredProjects}</h2>
          <div
            className={`featured-projects-carousel ${showFeaturedArrows ? 'featured-projects-carousel--with-nav' : ''}`}
          >
            {showFeaturedArrows && (
              <button
                type="button"
                className="featured-projects-nav featured-projects-nav--prev"
                onClick={goFeaturedPrev}
                aria-label={t.featuredProjectsPrev}
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
            )}
            {showFeaturedArrows ? (
              <div
                className="featured-projects-viewport"
                ref={featuredViewportRef}
              >
                <div
                  className="featured-projects-track"
                  style={{
                    transform: `translate3d(-${slideLayout.offsetPx}px, 0, 0)`,
                  }}
                >
                  {featuredProjects.map(featuredCard)}
                </div>
              </div>
            ) : (
              <div className="featured-projects-grid">
                {featuredProjects.map(featuredCard)}
              </div>
            )}
            {showFeaturedArrows && (
              <button
                type="button"
                className="featured-projects-nav featured-projects-nav--next"
                onClick={goFeaturedNext}
                aria-label={t.featuredProjectsNext}
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            )}
          </div>
        </section>
        )}
      </main>

      {/* Bottom CTA */}
      <footer className="landing-footer">
        <p className="body-sm text-ink-2">
          {t.connectQuestion}
          <a
            href="https://linkedin.com/in/axelklecki"
            target="_blank"
            rel="noopener noreferrer"
            className="text-g1 hover:underline font-medium"
          >
            {t.connectLinkedIn}
          </a>
        </p>
      </footer>
    </div>
  );
}

