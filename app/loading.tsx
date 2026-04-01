export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <p className="text-[var(--muted-foreground)] font-medium animate-pulse">Memuat halaman...</p>
      </div>
    </div>
  );
}
