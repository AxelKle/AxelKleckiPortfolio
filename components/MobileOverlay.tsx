'use client';

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

function DesktopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function MobileOverlay() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-y-6 bg-[#F7F5F2] px-4">
      <span className="topbar-logo text-2xl">
        Axel <span>Klecki</span>
      </span>

      <div className="flex items-center justify-center text-[#7F77DD]" aria-hidden>
        <DesktopIcon />
      </div>

      <div className="flex flex-col items-center gap-y-5">
        <h2 className="text-center text-lg font-bold">
          Disponible solo en desktop
        </h2>

        <p className="max-w-[280px] text-center text-sm text-[var(--color-text-secondary)]">
          Este portfolio fue diseñado para verse en pantallas grandes. Abrilo
          desde tu computadora para la mejor experiencia.
        </p>

        <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
          ¿Querés conectar igual?{' '}
          <a
            href="https://linkedin.com/in/axelklecki"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
            style={{ color: '#D4537E' }}
          >
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  );
}
