import { useEffect, useRef, useState, PropsWithChildren } from "react";

type CarouselProps = {
  autoPlay?: boolean;
  interval?: number; // ms
  pauseOnHover?: boolean;
  loop?: boolean;
  className?: string;
};

export default function Carousel({
  children,
  autoPlay = true,
  interval = 4000,
  pauseOnHover = true,
  loop = true,
  className = "",
}: PropsWithChildren<CarouselProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const el = ref.current;
    if (!el) return;

    const getSlideWidth = () => {
      // Busca cualquier hijo marcado como data-slide
      const slide =
        (el.querySelector<HTMLElement>("[data-slide]") as HTMLElement | null) ||
        (el.firstElementChild as HTMLElement | null);
      if (!slide) return 0;
      const styles = getComputedStyle(el);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return slide.clientWidth + gap;
    };

    const tick = () => {
      if (pauseOnHover && hovered) return;
      const slideW = getSlideWidth();
      if (!slideW) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = Math.min(el.scrollLeft + slideW, max);
      if (el.scrollLeft >= max - 2) {
        if (loop) el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollTo({ left: next, behavior: "smooth" });
      }
    };

    const id = window.setInterval(tick, interval);
    return () => window.clearInterval(id);
  }, [autoPlay, interval, pauseOnHover, loop, hovered]);

  return (
    <div className="relative">
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
            className={`flex items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 ${className} scrollbar-hide`}
        style={{ scrollBehavior: "smooth" }}
      >
        {children}
      </div>
    </div>
  );
}
