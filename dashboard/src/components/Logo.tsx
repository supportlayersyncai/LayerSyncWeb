/** The LayerSync mark plus the SyncSite product name, set like the website's wordmark. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img src="/icon-192.png" alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-lg" />
      {!compact && (
        <span className="leading-none">
          <span className="block text-[13px] font-semibold tracking-[0.28em] text-ink">LAYERSYNC</span>
          <span className="mt-1 block text-[9px] font-bold tracking-[0.34em] text-brand-green">SYNCSITE</span>
        </span>
      )}
    </span>
  );
}
