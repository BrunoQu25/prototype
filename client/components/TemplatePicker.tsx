import { PublishSeed } from "@/data/publish-templates";

export default function TemplatePicker({
  seeds,
  onPick,
}: {
  seeds: PublishSeed[];
  onPick: (s: PublishSeed) => void;
}) {
  return (
    <div className="-mx-4 px-4">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {seeds.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s)}
            className="flex-none w-40 rounded-xl bg-white border border-game-brown/10 shadow-sm hover:shadow-md transition text-left"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-game-gold/10">
              <img
                src={s.heroSrc}
                alt={s.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <div className="font-semibold text-sm line-clamp-2 text-game-brown">
                {s.title}
              </div>
              <div className="text-xs text-game-brown/70 mt-0.5">
                {s.players ?? "-"}
              </div>
              <div className="text-xs text-game-brown/70">
                {s.duration ?? "-"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
