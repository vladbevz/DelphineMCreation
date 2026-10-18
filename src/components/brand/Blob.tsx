import { cn } from '@/components/ui/cn';

/**
 * Organic colour patch behind a photo. On hover of the parent `.group` it morphs into a second
 * shape (SVG `d` transition, CSS only) and turns slightly. Colour via currentColor.
 */
export function Blob({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={cn(
        'pointer-events-none absolute transition-transform duration-700 ease-premium group-hover:scale-105 group-hover:rotate-12',
        className,
      )}
    >
      <path
        // Attribute = fallback shape for browsers without the CSS `d` property (Safari).
        d="M45,-58C57,-47,64,-30,68,-11C71,8,71,29,60,43C49,58,27,65,5,64C-17,63,-39,53,-54,37C-69,21,-77,-1,-71,-20C-65,-39,-45,-55,-25,-64C-5,-73,14,-75,30,-68Z"
        fill="currentColor"
        className="transition-[d] duration-700 ease-premium [d:path('M45,-58C57,-47,64,-30,68,-11C71,8,71,29,60,43C49,58,27,65,5,64C-17,63,-39,53,-54,37C-69,21,-77,-1,-71,-20C-65,-39,-45,-55,-25,-64C-5,-73,14,-75,30,-68Z')] group-hover:[d:path('M52,-62C65,-49,70,-28,71,-8C72,13,69,34,55,48C41,62,17,68,-4,66C-26,65,-46,56,-60,40C-74,24,-82,1,-76,-19C-70,-39,-50,-56,-30,-67C-10,-78,30,-82,52,-62Z')]"
        transform="translate(100 100)"
      />
    </svg>
  );
}
