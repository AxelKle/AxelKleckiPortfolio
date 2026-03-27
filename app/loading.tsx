export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm">
      <div className="typing-indicator" style={{ scale: 1.5, marginBottom: '12px' }}>
        <span />
        <span />
        <span />
      </div>
      <p className="text-sm text-[var(--ink-2)]">Cargando...</p>
    </div>
  );
}
