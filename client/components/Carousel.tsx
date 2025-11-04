import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmblaCarousel from "embla-carousel-react";

interface CarouselProps {
  children: React.ReactNode;
}

export default function Carousel({ children }: CarouselProps) {
  const [emblaRef, emblaApi] = EmblaCarousel({ align: "start", loop: false });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">{children}</div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-game-rust" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-game-rust" />
      </button>
    </div>
  );
}
