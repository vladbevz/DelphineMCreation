'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  ViewTransition,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { cn } from '@/components/ui/cn';

export type GalleryImage = {
  key: string;
  alt: string;
  /** 4:5 crop for the page; null when the image has no asset yet (placeholder). */
  src: string | null;
  /** Uncropped large version for the lightbox. */
  zoomSrc: string | null;
  lqip: string | null;
};

export function Gallery({
  images,
  title,
  transitionName,
}: {
  images: GalleryImage[];
  title: string;
  /** Matches the product card image so it flies into the gallery (View Transitions). */
  transitionName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }, []);

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  const open = (index: number) => {
    setLightbox(index);
    setZoom(null);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const step = useCallback(
    (delta: number) => {
      setZoom(null);
      setLightbox((i) => (i === null ? i : (i + delta + images.length) % images.length));
    },
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox, step]);

  const toggleZoom = (e: MouseEvent<HTMLButtonElement>) => {
    if (zoom) return setZoom(null);
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const current = lightbox === null ? null : images[lightbox];
  const multiple = images.length > 1;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="-mx-5 flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto sm:mx-0 [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carrousel"
        aria-label={`Photos de ${title}`}
      >
        {images.map((image, i) => (
          <SharedSlide key={image.key} name={i === 0 ? transitionName : undefined}>
            <div
              className="relative aspect-square w-full shrink-0 snap-center bg-sand"
              role="group"
              aria-roledescription="photo"
              aria-label={`${i + 1} sur ${images.length}`}
            >
              {image.src ? (
                <button
                  type="button"
                  onClick={() => open(i)}
                  className="group absolute inset-0 cursor-zoom-in"
                  aria-label={`Agrandir la photo ${i + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder={image.lqip ? 'blur' : 'empty'}
                    blurDataURL={image.lqip ?? undefined}
                    className="object-cover"
                  />
                </button>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <EarringMotif className="h-1/2 w-auto text-cognac/60" title={image.alt} />
                </div>
              )}
            </div>
          </SharedSlide>
        ))}
      </div>

      {multiple && (
        <div className="mt-2 flex justify-center gap-1 sm:mt-3 sm:justify-start sm:gap-2">
          {images.map((image, i) => (
            <button
              key={image.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-current={active === i ? 'true' : undefined}
              className="group p-2 sm:p-0"
            >
              {/* Mobile: dot. Desktop: thumbnail. */}
              <span
                className={cn(
                  'block size-2.5 rounded-full sm:hidden',
                  active === i ? 'bg-espresso' : 'bg-sand-border',
                )}
              />
              <span
                className={cn(
                  'relative hidden aspect-square w-14 overflow-hidden bg-sand transition-opacity sm:block',
                  active === i
                    ? 'outline outline-1 outline-offset-2 outline-espresso'
                    : 'opacity-60 group-hover:opacity-100',
                )}
              >
                {image.src && (
                  <Image src={image.src} alt="" fill sizes="48px" className="object-cover" />
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setLightbox(null)}
        aria-label={`Photo agrandie de ${title}`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-espresso p-0 text-linen backdrop:bg-espresso"
      >
        {current?.zoomSrc && (
          <div className="relative h-full w-full overflow-hidden">
            <button
              type="button"
              onClick={toggleZoom}
              className={cn('absolute inset-0', zoom ? 'cursor-zoom-out' : 'cursor-zoom-in')}
              aria-label={zoom ? 'Dézoomer' : 'Zoomer'}
            >
              <Image
                src={current.zoomSrc}
                alt={current.alt}
                fill
                sizes="100vw"
                quality={85}
                className="object-contain transition-transform duration-300"
                style={
                  zoom
                    ? { transform: 'scale(2.2)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              />
            </button>

            <button
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="absolute top-4 right-4 inline-flex size-12 items-center justify-center rounded-full bg-espresso/70 hover:bg-espresso"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="size-6"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            {multiple && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Photo précédente"
                  className="absolute top-1/2 left-3 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-espresso/70 hover:bg-espresso"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                    aria-hidden
                  >
                    <path d="m15 5-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Photo suivante"
                  className="absolute top-1/2 right-3 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-espresso/70 hover:bg-espresso"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                    aria-hidden
                  >
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </button>
                <p
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm"
                  aria-live="polite"
                >
                  {(lightbox ?? 0) + 1} / {images.length}
                </p>
              </>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

/** Wraps the first slide in a named <ViewTransition>; other slides render as-is. */
function SharedSlide({ name, children }: { name?: string; children: ReactNode }) {
  return name ? <ViewTransition name={name}>{children}</ViewTransition> : <>{children}</>;
}
