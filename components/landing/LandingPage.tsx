'use client';

import { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
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

  const isMobile = visibleFeaturedCols === 1;

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
  const showFeaturedArrows = !isMobile && featuredProjects.length > visibleFeaturedCols;

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

  const openFeaturedProject = (p: ProjectItem) => {
    openProject(p.slug);
  };

  const featuredCard = (p: ProjectItem, swipe = false) => (
    <button
      key={p.slug}
      type="button"
      onClick={() => openFeaturedProject(p)}
      className={swipe ? 'featured-project-card featured-project-card--swipe' : 'featured-project-card'}
      style={
        !swipe && showFeaturedArrows && slideLayout.cardWidthPx > 0
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
            sizes="(max-width: 767px) 78vw, 292px"
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
      {/* Floating nav */}
      <div className="fixed top-4 left-4 z-50">
        <span className="avail-badge">
          <span className="avail-badge-dot" />
          {t.availableForWork}
        </span>
      </div>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <a
          href="/axel-klecki-cv.pdf"
          download="Axel_Klecki_CV.pdf"
          className="pill-nav-btn pill-nav-btn--cv landing-header-cv"
        >
          {t.downloadCV}
        </a>
        <LanguageSwitcher />
      </div>

      {/* Main content */}
      <main className="landing-main relative flex-1 flex flex-col items-center pb-10 px-6" style={{ paddingTop: '80px' }}>
        {/* Background orbs */}
        <div className="landing-bg-fx" aria-hidden>
          <div className="landing-orb landing-orb-1" />
          <div className="landing-orb landing-orb-2" />
          <div className="landing-orb landing-orb-3" />
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center relative">
          {/* Headline */}
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
              <Send className="size-5" />
            </button>
          </div>

          {/* Suggestion pills — desktop only */}
          <div className="landing-suggestions hero-anim-4" style={{ marginTop: '12px' }}>
            {t.suggestedQuestions.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => enterChatView(q)}
                className="suggestion-btn"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Featured projects */}
        {featuredProjects.length > 0 && (
          <section
            className={`featured-projects-section featured-projects-section--landing w-full mx-auto relative${showFeaturedArrows ? ' featured-projects-section--landing-wide' : ''}`}
          >
            <h2 className="featured-projects-label">{t.featuredProjects}</h2>

            {/* Mobile: horizontal swipe */}
            {isMobile ? (
              <div className="featured-projects-swipe">
                {featuredProjects.map((p) => featuredCard(p, true))}
              </div>
            ) : (
              /* Desktop: arrow carousel or grid */
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
                      {featuredProjects.map((p) => featuredCard(p))}
                    </div>
                  </div>
                ) : (
                  <div className="featured-projects-grid">
                    {featuredProjects.map((p) => featuredCard(p))}
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
            )}

            {/* Ver todos button */}
            <div className="featured-projects-view-all">
              <Link href="/projects" className="featured-view-all-btn">
                {t.viewAllProjects}
              </Link>
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
        <a
          href="/axel-klecki-cv.pdf"
          download="Axel_Klecki_CV.pdf"
          className="pill-nav-btn mt-3"
        >
          {t.downloadCV}
        </a>
      </footer>
    </div>
  );
}
