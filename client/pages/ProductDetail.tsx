import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Star,
} from "lucide-react";

import Layout, { useSearchContext } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { games, type Game } from "@/data/games";
import { cn } from "@/lib/utils";

const ratingFilterOptions = [
  { id: "all", label: "Todas" },
  { id: 5 as const, label: "5★" },
  { id: 4 as const, label: "4★" },
  { id: 3 as const, label: "3★" },
  { id: 2 as const, label: "2★" },
  { id: 1 as const, label: "1★" },
  { id: "low", label: "1-2★" },
] as const;

type RatingFilterValue = (typeof ratingFilterOptions)[number]["id"];

export default function ProductDetail() {
  return (
    <Layout>
      <ProductDetailContent />
    </Layout>
  );
}

function ProductDetailContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { searchByCategory } = useSearchContext();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"detalles" | "resenas">(
    "detalles",
  );
  const [ratingFilter, setRatingFilter] = useState<RatingFilterValue>("all");
  const reviewsSectionRef = useRef<HTMLDivElement | null>(null);
  const numericId = Number(id);
  const game = games.find((g) => g.id === numericId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [numericId]);

  const recommendedGames = useMemo(() => getRecommendedGames(game), [game]);

  const filteredReviews = useMemo(
    () => filterReviews(game?.reviews_list ?? [], ratingFilter),
    [game, ratingFilter],
  );

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-game-brown">
        <p className="text-lg font-semibold">Juego no encontrado</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center justify-center gap-2 font-semibold text-game-rust underline decoration-dotted underline-offset-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  const ownerName = game.reviews_list?.[0]?.name ?? "Carla S";
  const ownerLocation = "Montevideo";
  const responseTime = "Responde cada 15 minutos";
  const ownerRating = 4.9;
  const ownerInitials = ownerName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  const handleCategoryClick = () => {
    searchByCategory(game.category);
    navigate("/");
  };

  const handleRatingSummaryClick = () => {
    setActiveTab("resenas");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        reviewsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div className="sm:px-6 sm:py-8 pb-48">
      <div className="relative">
        <div className="w-full h-[50vh] sm:h-[60vh] bg-gray-100 overflow-hidden">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-4 left-4 right-4 z-20 flex justify-start">
          <div className="bg-white/80 backdrop-blur-sm rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-md hover:bg-game-cream transition"
              aria-label="Volver"
              title="Volver"
            >
              <ChevronLeft className="w-5 h-5 text-game-brown" />
            </button>
            <Link
              to="/"
              className="text-sm text-game-brown hover:text-game-brown"
            >
              Inicio
            </Link>
            <span className="text-sm text-game-brown">›</span>
            <span className="text-sm font-semibold text-game-brown truncate max-w-[55vw]">
              {game.title}
            </span>
          </div>
        </div>
      </div>

      <div className="relative -mt-36 sm:-mt-44 z-10">
        <div className="rounded-t-3xl sm:rounded-3xl p-6 shadow-xl bg-game-cream">
          <button
            type="button"
            onClick={handleCategoryClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-game-rust bg-opacity-10 border border-game-rust rounded-full text-sm font-semibold text-game-brown hover:bg-game-rust hover:bg-opacity-90 hover:text-white transition"
            aria-label={`Filtrar por ${game.category}`}
          >
            {game.category}
          </button>

          <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
            <h1 className="text-4xl font-bold text-game-brown flex-1 min-w-0">
              {game.title}
            </h1>
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-pressed={isWishlisted}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-semibold transition",
                isWishlisted
                  ? "bg-white text-game-rust border-game-rust"
                  : "bg-transparent text-game-brown border-game-brown/40 hover:border-game-rust/60",
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isWishlisted ? "fill-current text-game-rust" : "",
                )}
              />
              Guardar para luego
            </button>
          </div>

          <button
            type="button"
            onClick={handleRatingSummaryClick}
            className="mt-3 flex flex-wrap items-center gap-3 text-left group"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5 transition",
                    i < Math.floor(game.rating)
                      ? "fill-game-gold text-game-gold"
                      : "text-game-brown text-opacity-20",
                  )}
                />
              ))}
            </div>
            <span className="font-bold text-lg text-game-brown group-hover:text-game-rust transition">
              {game.rating}
            </span>
            <span className="text-sm text-game-brown text-opacity-50">
              ({game.reviews} reseñas)
            </span>
            <span className="text-xs font-semibold text-game-rust uppercase tracking-wide">
              Ver reseñas
            </span>
          </button>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-game-brown mb-3">
              Propietario
            </h2>
            <div className="bg-white rounded-2xl p-4 border-2 border-game-brown border-opacity-10 shadow-md flex items-center justify-between flex-col gap-4 sm:flex-row sm:gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-lg font-bold text-white shadow-md">
                  {ownerInitials}
                </div>
                <div>
                  <p className="font-bold text-game-brown">{ownerName}</p>
                  <p className="text-sm text-game-brown text-opacity-60">
                    {ownerLocation} · {responseTime}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-game-gold" />
                    <span className="text-sm font-semibold text-game-brown">
                      {ownerRating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to={`/product/${game.id}/owner`}
                  className="flex-1 px-3 py-2 border rounded-md bg-transparent text-game-brown hover:bg-game-brown hover:text-white transition text-sm text-center"
                >
                  Ver perfil
                </Link>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "detalles" | "resenas")
            }
            className="mt-8"
          >
            <TabsList className="inline-flex h-12 items-center rounded-full bg-white px-1 py-1 text-game-brown shadow-inner border border-game-brown/10">
              <TabsTrigger
                value="detalles"
                className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-game-rust data-[state=active]:text-white"
              >
                Detalles
              </TabsTrigger>
              <TabsTrigger
                value="resenas"
                className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-game-rust data-[state=active]:text-white"
              >
                Reseñas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="mt-6 space-y-6">
              <section>
                <h2 className="text-xl font-bold text-game-brown mb-3">
                  Descripción
                </h2>
                <p className="text-game-brown text-opacity-75 leading-relaxed">
                  {game.description}
                </p>
              </section>

              <section className="bg-game-cream rounded-2xl p-6 border-2 border-game-brown border-opacity-10">
                <h3 className="text-lg font-bold text-game-brown mb-4">
                  Sobre el juego
                </h3>
                <div className="space-y-3">
                  <DetailRow
                    icon={<Clock className="w-5 h-5 text-game-rust" />}
                  >
                    {game.duration}
                  </DetailRow>
                  <DetailRow
                    icon={<Users className="w-5 h-5 text-game-rust" />}
                  >
                    {game.players}
                  </DetailRow>
                  <DetailRow icon={<span className="text-lg">📊</span>}>
                    Dificultad: {game.difficulty}
                  </DetailRow>
                </div>
                <Link
                  to={`/product/${game.id}/rules`}
                  className="w-full mt-4 px-4 py-3 bg-game-navy text-white rounded-xl font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
                >
                  <span>📜</span>Ver más
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </section>

              <section
                id="availability"
                className="bg-game-cream rounded-2xl p-6 border-2 border-game-brown border-opacity-10"
              >
                <h3 className="text-lg font-bold text-game-brown mb-3">
                  Verificar disponibilidad
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-game-brown">
                      Fecha inicio
                    </label>
                    <input
                      type="date"
                      value={selectedStart ?? ""}
                      onChange={(e) => {
                        setSelectedStart(e.target.value || null);
                        setAvailability(null);
                      }}
                      className="mt-1 px-3 py-2 rounded-md border"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-sm text-game-brown">Fecha fin</label>
                    <input
                      type="date"
                      value={selectedEnd ?? ""}
                      onChange={(e) => {
                        setSelectedEnd(e.target.value || null);
                        setAvailability(null);
                      }}
                      className="mt-1 px-3 py-2 rounded-md border"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedStart || !selectedEnd) {
                          setAvailability(false);
                          return;
                        }
                        const s = new Date(selectedStart);
                        const e = new Date(selectedEnd);
                        if (
                          Number.isNaN(s.getTime()) ||
                          Number.isNaN(e.getTime()) ||
                          e < s
                        ) {
                          setAvailability(false);
                          return;
                        }
                        const diff = Math.ceil(
                          (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24),
                        );
                        if (diff > 30) {
                          setAvailability(false);
                          return;
                        }
                        setAvailability(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-game-rust text-white"
                    >
                      Comprobar
                    </button>
                  </div>
                </div>
                {availability === true && (
                  <p className="mt-3 text-sm text-game-rust font-semibold">
                    Disponible para las fechas seleccionadas
                  </p>
                )}
                {availability === false && (
                  <p className="mt-3 text-sm text-red-600 font-semibold">
                    Fechas inválidas o no disponibles
                  </p>
                )}
              </section>

              <section className="rounded-2xl p-6 border-2 border-game-brown border-opacity-10 shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-2xl font-bold text-game-brown">
                    Juegos recomendados
                  </h3>
                  <button
                    type="button"
                    onClick={handleCategoryClick}
                    className="text-sm font-semibold text-game-rust underline decoration-dotted underline-offset-4"
                  >
                    Ver más de {game.category}
                  </button>
                </div>
                {recommendedGames.length > 0 ? (
                  <div className="mt-4">
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                      {recommendedGames.map((recommendation) => (
                        <Link
                          key={recommendation.id}
                          to={`/product/${recommendation.id}`}
                          className="flex gap-3 rounded-2xl border border-game-brown/15 bg-white p-3 hover:shadow-lg transition flex-shrink-0 w-72 snap-start items-center"
                        >
                          <img
                            src={recommendation.image}
                            alt={recommendation.title}
                            className="h-40 w-28 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-game-brown line-clamp-1">
                              {recommendation.title}
                            </p>
                            <p className="text-sm text-game-brown/70">
                              {recommendation.category}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-game-brown mt-2">
                              <Star className="w-4 h-4 text-game-gold" />
                              {recommendation.rating}
                              <span className="text-xs text-game-brown/60">
                                · {recommendation.players}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-game-brown/70">
                    No encontramos recomendaciones similares, pero podés
                    explorar el catálogo completo.
                  </p>
                )}
              </section>
            </TabsContent>

            <TabsContent
              value="resenas"
              className="mt-6 space-y-4"
              ref={reviewsSectionRef}
              id="reviews"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-bold text-game-brown flex items-center gap-2">
                  <span className="text-4xl">💬</span>
                  Reseñas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {ratingFilterOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRatingFilter(option.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full border text-sm font-semibold transition",
                        ratingFilter === option.id
                          ? "bg-game-rust text-white border-game-rust"
                          : "border-game-brown/20 text-game-brown hover:border-game-brown/60",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  {filteredReviews.map((review, idx) => {
                    const initials = review.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("");
                    return (
                      <div
                        key={`${review.name}-${idx}`}
                        className="bg-white rounded-xl p-4 border-2 border-game-brown border-opacity-10 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-bold text-game-brown">
                                {review.name}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-game-gold text-game-gold" />
                                <span className="text-sm font-semibold text-game-brown">
                                  {review.rating}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-game-brown text-opacity-75 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 border-2 border-game-brown border-opacity-10 shadow-sm mb-6 text-center">
                  <p className="text-game-brown text-opacity-60">
                    No hay reseñas que coincidan con este filtro. Probá con otra
                    calificación.
                  </p>
                </div>
              )}

              <Link
                to={`/product/${game.id}/reviews`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-game-rust text-white rounded-xl font-bold hover:bg-opacity-90 transition"
              >
                Ver todas las reseñas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="fixed left-1/2 bottom-4 z-50 -translate-x-1/2 w-full max-w-3xl px-3 sm:px-6">
        <div className="bg-gradient-to-r from-game-rust to-orange-600 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <div className="text-white text-sm">Precio</div>
            <div className="text-white font-bold text-xl">
              ${game.price} <span className="text-sm font-normal">/día</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {availability === true && selectedStart && selectedEnd ? (
              <Link
                to={`/product/${game.id}/rental`}
                state={{ start: selectedStart, end: selectedEnd }}
                className="px-4 py-2 rounded-lg bg-white text-game-rust font-bold border-2 border-white"
              >
                Alquilar
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("availability")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="px-4 py-2 rounded-lg bg-white text-game-rust font-bold border-2 border-white"
              >
                Verificar disponibilidad
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-game-brown">
      <span className="flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function getRecommendedGames(currentGame?: Game) {
  if (!currentGame) return [];
  const currentCategory = normalize(currentGame.category);
  const currentDifficulty = normalize(currentGame.difficulty);
  const currentPlayers = parsePlayersRange(currentGame.players);

  return games
    .filter((candidate) => candidate.id !== currentGame.id)
    .map((candidate) => {
      const candidateRange = parsePlayersRange(candidate.players);
      let score = 0;
      if (normalize(candidate.category) === currentCategory) score += 3;
      if (normalize(candidate.difficulty) === currentDifficulty) score += 1.5;
      if (rangesOverlap(candidateRange, currentPlayers)) score += 1;
      score += Math.max(0, 1 - Math.abs(candidate.rating - currentGame.rating));
      return { candidate, score };
    })
    .sort(
      (a, b) => b.score - a.score || b.candidate.rating - a.candidate.rating,
    )
    .slice(0, 4)
    .map((entry) => entry.candidate);
}

function filterReviews(
  reviews: Game["reviews_list"],
  filter: RatingFilterValue,
) {
  if (filter === "all") return reviews;
  if (filter === "low") return reviews.filter((review) => review.rating <= 2);
  return reviews.filter((review) => review.rating === filter);
}

function parsePlayersRange(value: string) {
  const matches = value.match(/\d+/g)?.map(Number);
  if (!matches || matches.length === 0) {
    return { min: undefined, max: undefined };
  }
  return {
    min: Math.min(...matches),
    max: Math.max(...matches),
  };
}

function rangesOverlap(
  a: { min?: number; max?: number },
  b: { min?: number; max?: number },
) {
  if (
    a.min === undefined ||
    a.max === undefined ||
    b.min === undefined ||
    b.max === undefined
  ) {
    return false;
  }
  return a.min <= b.max && b.min <= a.max;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
