import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WizardProps {
  steps: string[];
  current: number;
  onPrev?: () => void;
  onNext?: () => void;
  onGoTo?: (index: number) => void; // NUEVO
  className?: string;
}

export default function Wizard({
  steps,
  current,
  onPrev,
  onNext,
  onGoTo,
  className,
}: WizardProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="-mx-4 px-4">
        <ol className="flex items-center gap-3 mb-4 overflow-x-auto">
          {steps.map((s, i) => {
            const active = i === current;
            const passed = i < current;
            return (
              <li key={s} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onGoTo?.(i)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ring-offset-2",
                    "transition outline-none",
                    active
                      ? "bg-game-gold text-brown-900"
                      : passed
                        ? "bg-brown-300 text-brown-900 hover:bg-brown-400"
                        : "bg-brown-200 text-brown-600 hover:bg-brown-300",
                  )}
                >
                  {i + 1}
                </button>
                <span
                  className={cn(
                    "hidden sm:inline text-xs sm:text-sm whitespace-nowrap",
                    active ? "font-semibold" : "text-brown-600",
                  )}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-8 sm:w-12 h-px bg-brown-300 mx-2 shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Acciones */}
      <div className="hidden sm:flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
        >
          Atrás
        </Button>
        <Button type="button" onClick={onNext} disabled={!onNext}>
          Siguiente
        </Button>
      </div>
      {/* Mobile sticky */}
      <div className="sm:hidden sticky bottom-24 z-10 px-1">
        <div className="flex justify-between bg-white/80 backdrop-blur rounded-xl p-2 border border-game-brown/10">
          <Button
            variant="outline"
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
          >
            Atrás
          </Button>
          <Button type="button" onClick={onNext} disabled={!onNext}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
