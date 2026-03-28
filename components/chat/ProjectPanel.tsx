'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  reactNodeToPlainText,
  translateProjectH2Heading,
  translateProjectH3Heading,
} from '@/lib/projectMdxHeadings';
import type { Locale } from '@/lib/translations';

function createMdxComponents(locale: Locale) {
  return {
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <span className="block my-8 sm:my-10">
        <img
          {...props}
          alt={props.alt || ''}
          className="max-w-full h-auto object-contain rounded-xl border border-[#E8E4DC] mx-auto"
        />
      </span>
    ),
    h2: ({ children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        {...rest}
        className="mt-7 mb-3 border-b border-[#E8E4DC] pb-2 first:mt-0 text-[13px] font-semibold uppercase tracking-[0.02em] text-[#14121A]"
      >
        {translateProjectH2Heading(reactNodeToPlainText(children), locale)}
      </h2>
    ),
    h3: ({ children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        {...rest}
        className="mt-6 mb-2 first:mt-0 text-sm font-semibold text-[#14121A]"
      >
        {translateProjectH3Heading(reactNodeToPlainText(children), locale)}
      </h3>
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-sm font-light leading-[1.8] text-[#7A7585]" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="my-5 list-disc space-y-1.5 pl-5 text-sm font-light leading-[1.8] text-[#7A7585]" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="my-5 list-decimal space-y-1.5 pl-5 text-sm font-light leading-[1.8] text-[#7A7585]" {...props} />
    ),
  };
}

function StatusDot({ status }: { status: string }) {
  const normalised = status.toLowerCase();
  const isShipped = normalised === 'shipped' || normalised === 'lanzado';
  const isActive = normalised === 'active' || normalised === 'activo';

  let colorClass = 'project-detail-status-dot--default';
  if (isShipped) colorClass = 'project-detail-status-dot--shipped';
  else if (isActive) colorClass = 'project-detail-status-dot--active';

  return <span className={`project-detail-status-dot ${colorClass}`} aria-hidden="true" />;
}

export function ProjectPanel() {
  const { openSlug } = useProject();
  const { t, locale } = useLanguage();
  const mdxComponents = useMemo(() => createMdxComponents(locale), [locale]);
  const [data, setData] = useState<{
    frontmatter: Record<string, unknown>;
    compiledSource: string;
    scope: Record<string, unknown>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!openSlug) {
      setData(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/projects/${openSlug}?locale=${locale}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Project not found');
        return res.json();
      })
      .then(setData)
      .catch(() => setError('load_error'))
      .finally(() => setLoading(false));
  }, [openSlug, locale]);

  const frontmatter = data?.frontmatter as {
    title?: string;
    company?: string;
    role?: string;
    status?: string;
    tags?: string[];
    link?: string;
    demoVideo?: string;
    cover?: string;
    period?: string;
  } | undefined;

  return (
    <div className="project-panel h-full min-h-0 flex flex-col bg-white">
      <span className="sr-only">{t.projectPanelLabel}</span>
      <div className="project-panel-body project-modal-body-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {loading && (
          <div className="project-modal-content-px text-center text-[var(--ink-2)] body-sm">
            {t.loadingProject}
          </div>
        )}
        {error && (
          <div className="project-modal-content-px text-center text-red-500 body-sm">
            {t.projectLoadError}
          </div>
        )}
        {data && frontmatter && !loading && (
          <>
            {/* ── HERO ────────────────────────────────────────────── */}
            <div className="project-detail-hero">
              {/* Ambient orbs */}
              <span className="project-detail-hero-orb-1" aria-hidden="true" />
              <span className="project-detail-hero-orb-2" aria-hidden="true" />
              <span className="project-detail-hero-orb-3" aria-hidden="true" />

              {/* Cover image */}
              {frontmatter.cover && (
                <Image
                  src={frontmatter.cover}
                  alt={frontmatter.title || 'Cover'}
                  fill
                  className="object-cover object-top"
                  style={{ zIndex: 2 }}
                  sizes="(max-width: 900px) 100vw, 900px"
                  priority
                />
              )}

              {/* Dark gradient overlay */}
              <div className="project-detail-hero-overlay" aria-hidden="true" />

              {/* Hero text */}
              <div className="project-detail-hero-content">
                {(frontmatter.company || frontmatter.period) && (
                  <p className="project-detail-company">
                    {[frontmatter.company, frontmatter.period].filter(Boolean).join(' · ')}
                  </p>
                )}
                <h1 id="project-modal-title" className="project-detail-title">
                  {frontmatter.title}
                </h1>
                <div className="project-detail-meta">
                  {frontmatter.role && (
                    <span className="project-detail-meta-role">{frontmatter.role}</span>
                  )}
                  {frontmatter.tags && frontmatter.tags.length > 0 && (
                    <div className="project-detail-meta-tags">
                      {frontmatter.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="project-detail-meta-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ── BODY ─────────────────────────────────────────────── */}
            <div className="project-modal-content-px pb-14">
              <div className="project-panel-mdx prose prose-sm max-w-none [&_h2]:!mb-3 [&_h2]:!mt-7 [&_h2]:!border-b [&_h2]:!border-[#E8E4DC] [&_h2]:!pb-2 [&_h2:first-child]:!mt-0 [&_h2+p]:!mt-0 [&_li]:!font-light [&_li]:!text-[#7A7585] [&_p]:!my-0 [&_p]:!font-light [&_p]:!text-[#7A7585] [&_p:not(:last-child)]:!mb-6 [&_p:last-child]:!mb-0">
                <MDXRemote
                  compiledSource={data.compiledSource}
                  scope={data.scope}
                  components={mdxComponents}
                />
              </div>
              {/* Action buttons */}
              {(frontmatter.link || frontmatter.demoVideo) && (
                <div className="flex flex-wrap gap-3 mt-16">
                  {frontmatter.link && (
                    <a href={frontmatter.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm inline-flex">
                      {t.viewProjectLive}
                    </a>
                  )}
                  {frontmatter.demoVideo && (
                    <a href={frontmatter.demoVideo} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm inline-flex">
                      {t.viewDemo}
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="project-panel-cta-spacer shrink-0" aria-hidden />
          </>
        )}
      </div>
    </div>
  );
}
