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
    <div className="bg-olive px-5 py-2.5 text-center text-xs tracking-wide text-white sm:text-sm">
      {text}
    </div>
  );
}
