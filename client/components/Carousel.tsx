import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode;
}

export default function Carousel({ children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      // Calculate scroll amount based on item width (approximately 1/3 of container width + gap)
      const container = containerRef.current;
      const itemWidth = container.offsetWidth / 3 + 16; // 16px for gap
      const scrollAmount = itemWidth;
      const newScrollLeft =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex gap-4 pb-2">{children}</div>
      </div>

      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-game-rust" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-game-rust" />
        </button>
      )}
    </div>
  );
}
