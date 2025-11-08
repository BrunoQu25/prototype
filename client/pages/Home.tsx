import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Star } from "lucide-react";

import Layout, { useSearchContext } from "@/components/Layout";
import { categories, games, isGameAvailable, type Game } from "@/data/games";
import { loadListings } from "@/state/listings";
import type { PublishedGame } from "@/state/listings";
import { cn } from "@/lib/utils";

const formatUYU = (value: number) =>
  new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(value);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const listingToGame = (listing: PublishedGame, index: number): Game => {
  const hex = listing.id.replace(/-/g, "").slice(0, 8);
  const parsed = Number.parseInt(hex, 16);
  const id = Number.isNaN(parsed) ? 10000 + index : 10000 + parsed;

  return {
    id,
    title: listing.title,
    category: listing.category,
    image:
      listing.images.find((img) => img.type === "hero")?.url ||
      listing.images[0]?.url ||
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
    rating: listing.rating ?? 4.8,
    reviews: listing.reviews ?? 0,
    description: listing.description,
    duration: listing.duration ?? "60 min",
    players: listing.players ?? "2-4 jugadores",
    difficulty: listing.difficulty ?? "Medio",
    price: listing.pricePerDay,
    rules: {
      video: "",
      text: listing.description,
    },
    reviews_list: [],
  };
};

const availabilityLabel = (game: Game) => {
  const slot = game.availability?.[0];
  if (!slot) return "Disponible todo el mes";
  try {
    const formatter = new Intl.DateTimeFormat("es-UY", {
      month: "short",
      day: "numeric",
    });
    return `Del ${formatter.format(new Date(slot.from))} al ${formatter.format(
      new Date(slot.to),
    )}`;
  } catch {
    return "Fechas limitadas";
  }
};

export default function Home() {
  return (
    <Layout>
      <HomeContent />
    </Layout>
  );
}

function HomeContent() {
  const {
    query,
    startDate,
    endDate,
    clearSearch,
    randomPickToken,
    searchByCategory,
    selectedCategory,
  } = useSearchContext();
  const [surpriseGame, setSurpriseGame] = useState<Game | null>(null);
  const navigate = useNavigate();

  const dynamicListings = useMemo(() => {
    try {
      return loadListings().filter((item) => item.visibility === "public");
    } catch {
      return [];
    }
  }, []);

  const userGames = useMemo(
    () => dynamicListings.map((listing, idx) => listingToGame(listing, idx)),
    [dynamicListings],
  );

  const allGames = useMemo(() => [...games, ...userGames], [userGames]);

  const filteredGames = useMemo(() => {
    const normalized = query ? normalizeText(query) : "";
    const matchesText = (game: Game) =>
      normalized
        ? [game.title, game.category, game.description].some((field) =>
            normalizeText(field).includes(normalized),
          )
        : true;

    const baseList = allGames.filter(matchesText);
    if (startDate && endDate) {
      return [...baseList].sort((a, b) => {
        const availB = isGameAvailable(b, startDate, endDate) ? 1 : 0;
        const availA = isGameAvailable(a, startDate, endDate) ? 1 : 0;
        return availB - availA;
      });
    }
    return baseList;
  }, [allGames, query, startDate, endDate]);

  useEffect(() => {
    if (!randomPickToken) return;
    const pool = filteredGames.length ? filteredGames : allGames;
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSurpriseGame(pick);
    navigate(`/product/${pick.id}`);
  }, [randomPickToken, filteredGames, allGames, navigate]);

  const dateFilterActive = Boolean(startDate && endDate);
  const hasFilters = Boolean(query || dateFilterActive);
  const noResults = filteredGames.length === 0;
  const resultsTitle = selectedCategory
    ? `Juegos de ${selectedCategory}`
    : "Resultados de tu búsqueda";

  const curatedSections = [
    {
      key: "recommended",
      title: "Recomendados para vos",
      description: "Nuestra mezcla favorita de clásicos y estrenos recientes.",
      variant: "carousel" as const,
      games: filteredGames.slice(0, 6),
    },
    {
      key: "coop",
      title: "Cooperativos populares",
      description: "Perfectos para ganar (o perder) todos juntos.",
      variant: "carousel" as const,
      games: filteredGames
        .filter((game) => game.category.toLowerCase().includes("cooper"))
        .slice(0, 4),
    },
    {
      key: "family",
      title: "Para jugar en familia",
      description: "Reglas simples y partidas ágiles para todas las edades.",
      variant: "grid" as const,
      games: filteredGames
        .filter((game) => game.category.toLowerCase().includes("familiar"))
        .slice(0, 4),
    },
    {
      key: "party",
      title: "Fiesta y party games",
      description: "Animá tu reunión con risas y creatividad.",
      variant: "carousel" as const,
      games: filteredGames
        .filter((game) => game.category.toLowerCase().includes("fiesta"))
        .slice(0, 4),
    },
    {
      key: "strategy",
      title: "Noches estratégicas",
      description: "Opciones para jugones que buscan desafíos profundos.",
      variant: "grid" as const,
      games: filteredGames
        .filter((game) =>
          ["estrategia", "experto", "deck"].some((tag) =>
            game.category.toLowerCase().includes(tag),
          ),
        )
        .slice(0, 4),
    },
  ].filter((section) => section.games.length > 0);

  return (
    <section className="px-4 sm:px-8 py-6 sm:py-10 space-y-10">
      {!hasFilters && (
        <>
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-wide text-game-brown/70 font-semibold">
              Descubrí tu próximo juego
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-game-brown">
              Catálogo curado de alquileres
            </h1>
            <p className="text-game-brown/70 max-w-2xl">
              Filtramos por disponibilidad, duración y estilo para que puedas
              elegir el juego ideal para tu noche lúdica. Reservá en minutos y
              recibí en tu casa.
            </p>
          </header>

          {surpriseGame && (
            <div className="rounded-3xl bg-gradient-to-r from-amber-200 via-rose-200 to-pink-200 border border-white/60 shadow-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-game-brown/60 uppercase tracking-wide">
                  Te recomendamos
                </p>
                <h2 className="text-2xl font-bold text-game-brown">
                  {surpriseGame.title}
                </h2>
                <p className="text-game-brown/70 max-w-xl">
                  {surpriseGame.description}
                </p>
              </div>
              <Link
                to={`/product/${surpriseGame.id}`}
                className="px-5 py-3 rounded-full bg-game-brown text-white font-semibold shadow-lg hover:opacity-90 transition"
              >
                Ver detalles
              </Link>
            </div>
          )}

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-game-brown">
                Explorá por categoría
              </h2>
              <span className="text-sm text-game-brown/60">
                Usa los atajos para filtrar al instante
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => searchByCategory(category.name)}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-game-brown/20 px-4 py-3 text-left shadow-sm hover:shadow-lg transition"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="text-sm text-game-brown/60">Buscar</p>
                    <p className="font-semibold text-game-brown">
                      {category.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {curatedSections.map((section) => (
            <SectionBlock
              key={section.key}
              title={section.title}
              description={section.description}
              games={section.games}
              variant={section.variant}
            />
          ))}

          <SectionBlock
            title="Catálogo completo"
            description="Todo lo que podés alquilar hoy mismo."
            games={filteredGames}
            variant="grid"
          />
        </>
      )}

      {hasFilters && (
        <>
          {noResults ? (
            <div className="rounded-3xl bg-white border border-dashed border-game-brown/40 p-8 text-center space-y-4 shadow-sm">
              <p className="text-xl font-semibold text-game-brown">
                No encontramos juegos para esta búsqueda.
              </p>
              <p className="text-game-brown/70">
                Probá cambiando el texto o el rango de fechas para ver más
                resultados.
              </p>
              <button
                className="px-5 py-3 rounded-full bg-game-brown text-white font-semibold hover:opacity-90 transition"
                onClick={clearSearch}
              >
                Borrar filtros
              </button>
            </div>
          ) : (
            <SectionBlock
              title={resultsTitle}
              description={
                dateFilterActive
                  ? "Ordenamos primero los disponibles en tus fechas."
                  : "Estos juegos coinciden con tu búsqueda."
              }
              games={filteredGames}
              variant="grid"
              highlightAvailability={dateFilterActive}
              startDate={startDate}
              endDate={endDate}
              action={
                <Link
                  to="/"
                  onClick={clearSearch}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-game-brown/70 hover:text-game-brown transition-colors"
                  aria-label="Volver al inicio"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              }
            />
          )}
        </>
      )}
    </section>
  );
}

interface SectionBlockProps {
  title: string;
  description: string;
  games: Game[];
  variant?: "grid" | "carousel";
  highlightAvailability?: boolean;
  startDate?: string;
  endDate?: string;
  action?: ReactNode;
}

function SectionBlock({
  title,
  description,
  games,
  variant = "grid",
  highlightAvailability = false,
  startDate,
  endDate,
  action,
}: SectionBlockProps) {
  if (!games.length) return null;
  return (
    <section className="space-y-4" aria-label={title}>
      <div
        className={cn(
          "flex items-start",
          action ? "gap-3" : "justify-between",
        )}
      >
        {action ? <div className="flex-shrink-0">{action}</div> : null}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-game-brown">{title}</h2>
          <p className="text-game-brown/70 text-sm">{description}</p>
        </div>
      </div>

      {variant === "grid" ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              highlightAvailability={highlightAvailability}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
          {games.map((game) => (
            <div className="snap-start flex-shrink-0 w-72" key={game.id}>
              <GameCard
                game={game}
                variant="tall"
                highlightAvailability={highlightAvailability}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function GameCard({
  game,
  variant = "standard",
  highlightAvailability = false,
  startDate,
  endDate,
}: {
  game: Game;
  variant?: "standard" | "tall";
  highlightAvailability?: boolean;
  startDate?: string;
  endDate?: string;
}) {
  const { searchByCategory } = useSearchContext();
  const showRangeMessage =
    highlightAvailability && startDate && endDate ? true : false;
  const availableForRange = showRangeMessage
    ? isGameAvailable(game, startDate, endDate)
    : undefined;

  return (
    <article
      id={`game-${game.id}`}
      className={cn(
        "bg-white rounded-3xl border border-game-brown/10 shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col",
        variant === "tall" && "h-full",
      )}
    >
      <Link to={`/product/${game.id}`} className="flex flex-col h-full">
        <div className="relative">
          <img
            src={game.image}
            alt={game.title}
            className={cn(
              "w-full object-cover",
              variant === "tall" ? "h-56" : "h-48",
            )}
            loading="lazy"
          />
          <button
            type="button"
            className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full text-game-brown shadow-sm hover:bg-white"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              searchByCategory(game.category);
            }}
          >
            {game.category}
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-game-brown">
                {game.title}
              </h3>
              <p className="text-sm text-game-brown/70 line-clamp-2">
                {game.description}
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-game-brown whitespace-nowrap">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {game.rating.toFixed(1)}
            </span>
          </div>

          <div className="text-sm text-game-brown/70 flex flex-wrap gap-2">
            <span>{game.players}</span>
            <span>•</span>
            <span>{game.duration}</span>
            <span>•</span>
            <span>{game.difficulty}</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs text-game-brown/60">Desde</p>
              <p className="text-xl font-semibold text-game-brown">
                {formatUYU(game.price)}
              </p>
            </div>
            <div className="text-right">
              {showRangeMessage && (
                <p
                  className={cn(
                    "text-xs font-semibold",
                    availableForRange ? "text-emerald-600" : "text-red-500",
                  )}
                >
                  {availableForRange
                    ? "Disponible en tus fechas"
                    : "No disponible en tus fechas"}
                </p>
              )}
              <p className="text-xs text-game-brown/60">
                {availabilityLabel(game)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
