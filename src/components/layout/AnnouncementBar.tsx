import { LeopardPattern } from '@/components/brand/LeopardPattern';
import { getSettings } from '@/lib/sanity/data';

/** Thin bar above the header: vacation notice takes priority over the announcement. */
export async function AnnouncementBar() {
  const settings = await getSettings();
  const vacation = settings?.vacationMode?.enabled
    ? settings.vacationMode.message ||
      'La boutique est en pause : les commandes reprendront bientôt.'
    : null;
  const text =
    vacation ?? (settings?.announcementBar?.enabled ? settings.announcementBar.text : null);
  if (!text) return null;

  return (
    <div className="relative overflow-hidden bg-soleil px-5 pt-2.5 pb-3.5 text-center text-[0.7rem] font-medium tracking-[0.15em] text-espresso uppercase">
      {text}
      {/* Thin leopard edge along the bottom. */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 text-espresso/70">
        <LeopardPattern scale={0.35} />
      </span>
    </div>
  );
}
