import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronRight,
  ListFilter,
  Star,
  CheckCircle2,
  XCircle,
  Check,
  X,
} from "lucide-react";

import Layout, { useSearchContext } from "@/components/Layout";
import {
  filterShortcuts,
  games,
  isGameAvailable,
  primaryCategories,
  type FilterShortcut,
  type Game,
} from "@/data/games";
import { loadListings } from "@/state/listings";
import type { PublishedGame } from "@/state/listings";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const formatUYU = (value: number) =>
  new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    currencyDisplay: "narrowSymbol",
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

const formatRange = (from: string, to: string) => {
  const formatter = new Intl.DateTimeFormat("es-UY", {
    month: "short",
    day: "numeric",
  });
  return `${formatter.format(new Date(from))} al ${formatter.format(
    new Date(to),
  )}`;
};

const availabilityLabel = (
  game: Game,
  searchStart?: string,
  searchEnd?: string,
) => {
  const ranges = game.availability;
  if (!ranges || ranges.length === 0) return "Calendario a coordinar";

  const startTs =
    searchStart && !Number.isNaN(Date.parse(searchStart))
      ? Date.parse(searchStart)
      : null;
  const endTs =
    searchEnd && !Number.isNaN(Date.parse(searchEnd))
      ? Date.parse(searchEnd)
      : null;

  if (startTs && endTs) {
    const covering = ranges.find((range) => {
      const from = Date.parse(range.from);
      const to = Date.parse(range.to);
      if (Number.isNaN(from) || Number.isNaN(to)) return false;
      return from <= startTs && to >= endTs;
    });
    if (covering) {
      return `Ventana disponible: ${formatRange(covering.from, covering.to)}`;
    }

    const upcoming = [...ranges]
      .map((range) => ({
        ...range,
        fromTs: Date.parse(range.from),
      }))
      .filter((range) => !Number.isNaN(range.fromTs))
      .sort((a, b) => a.fromTs - b.fromTs)
      .find((range) => range.fromTs >= startTs);

    if (upcoming) {
      return `Próximo turno: ${formatRange(upcoming.from, upcoming.to)}`;
    }
  }

  return `Disponible del ${formatRange(ranges[0].from, ranges[0].to)}`;
};

type PlayersRangeOption = "any" | "2" | "3-4" | "5-6" | "7+";
type DurationRangeOption = "any" | "lte30" | "30-60" | "60-90" | "90+";
type DifficultyFilterValue = "any" | "facil" | "media" | "dificil" | "experto";
type SortOption = "availability" | "price" | "rating" | "duration";

type FiltersState = {
  playersRange: PlayersRangeOption;
  durationRange: DurationRangeOption;
  priceMin?: number;
  priceMax?: number;
  difficulty: DifficultyFilterValue;
  experienceTypes: string[];
  onlyAvailableInDates: boolean;
  minRating: number | null;
};

type ActiveFilterChip = {
  key: string;
  label: string;
  onClear: () => void;
};

const buildDefaultFilters = (): FiltersState => ({
  playersRange: "any",
  durationRange: "any",
  priceMin: undefined,
  priceMax: undefined,
  difficulty: "any",
  experienceTypes: [],
  onlyAvailableInDates: false,
  minRating: null,
});

const durationFilterOptions: Array<{
  id: DurationRangeOption;
  label: string;
  minMinutes?: number;
  maxMinutes?: number;
}> = [
  { id: "any", label: "Cualquier duración" },
  { id: "lte30", label: "≤30 min", maxMinutes: 30 },
  { id: "30-60", label: "30–60 min", minMinutes: 30, maxMinutes: 60 },
  { id: "60-90", label: "60–90 min", minMinutes: 60, maxMinutes: 90 },
  { id: "90+", label: "90+ min", minMinutes: 90 },
];

const playersRangeOptions: Array<{
  id: PlayersRangeOption;
  label: string;
  min?: number;
  max?: number;
}> = [
  { id: "any", label: "Cualquiera" },
  { id: "2", label: "2", min: 2, max: 2 },
  { id: "3-4", label: "3–4", min: 3, max: 4 },
  { id: "5-6", label: "5–6", min: 5, max: 6 },
  { id: "7+", label: "7+", min: 7 },
];

const difficultyOptions: Array<{
  id: DifficultyFilterValue;
  label: string;
}> = [
  { id: "any", label: "Cualquiera" },
  { id: "facil", label: "Fácil" },
  { id: "media", label: "Media" },
  { id: "dificil", label: "Difícil" },
  { id: "experto", label: "Experto" },
];

const experienceOptions = [
  { id: "Familiar", label: "Familiar" },
  { id: "Fiesta", label: "Fiesta" },
  { id: "Cooperativo", label: "Cooperativo" },
  { id: "Estrategia", label: "Estrategia" },
  { id: "Abstracto", label: "Abstracto" },
];

const ratingOptions: Array<{ id: number | null; label: string }> = [
  { id: null, label: "Cualquiera" },
  { id: 4, label: "≥ 4.0" },
  { id: 4.5, label: "≥ 4.5" },
];

const gradientPalette = [
  "from-amber-100 via-orange-50 to-yellow-100",
  "from-rose-100 via-pink-50 to-fuchsia-100",
  "from-sky-100 via-blue-50 to-indigo-100",
  "from-emerald-100 via-green-50 to-lime-100",
  "from-purple-100 via-violet-50 to-rose-100",
  "from-cyan-100 via-teal-50 to-blue-100",
];

const getGradient = (index: number) =>
  gradientPalette[index % gradientPalette.length];

const playersRangeChipLabels: Record<PlayersRangeOption, string> = {
  any: "",
  "2": "2 jugadores",
  "3-4": "3–4 jugadores",
  "5-6": "5–6 jugadores",
  "7+": "7+ jugadores",
};

const durationRangeChipLabels: Record<DurationRangeOption, string> = {
  any: "",
  lte30: "Hasta 30 min",
  "30-60": "30–60 min",
  "60-90": "60–90 min",
  "90+": "90+ min",
};

const difficultyChipLabels: Record<DifficultyFilterValue, string> = {
  any: "",
  facil: "Fácil",
  media: "Media",
  dificil: "Difícil",
  experto: "Experto",
};

const parsePlayersRange = (value: string) => {
  const matches = value.match(/\d+/g)?.map(Number);
  if (!matches || matches.length === 0)
    return { min: undefined, max: undefined };
  if (matches.length === 1) {
    return { min: matches[0], max: matches[0] };
  }
  return {
    min: Math.min(...matches),
    max: Math.max(...matches),
  };
};

const parseDurationMinutes = (value: string) => {
  const matches = value.match(/\d+/g)?.map(Number);
  if (!matches || matches.length === 0) return undefined;
  if (matches.length === 1) return matches[0];
  const avg = matches.reduce((acc, n) => acc + n, 0) / matches.length;
  return Math.round(avg);
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
    setDates,
    clearSearch,
    randomPickToken,
    searchByCategory,
    selectedCategory,
    openSearchPanel,
    setQuery,
  } = useSearchContext();
  const [surpriseGame, setSurpriseGame] = useState<Game | null>(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersState>(() =>
    buildDefaultFilters(),
  );
  const [sortOption, setSortOption] = useState<SortOption>("availability");
  const handleResetAll = useCallback(() => {
    setFilters(buildDefaultFilters());
    setSortOption("availability");
    clearSearch();
  }, [clearSearch]);
  const clearFiltersPreservingQuery = useCallback(() => {
    setFilters(buildDefaultFilters());
  }, []);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const openFiltersScreen = useCallback(() => {
    setIsFiltersOpen(true);
  }, []);
  const closeFiltersScreen = useCallback(() => {
    setIsFiltersOpen(false);
  }, []);
  const applyFiltersFromModal = useCallback(
    (nextFilters: FiltersState) => {
      setFilters(nextFilters);
      closeFiltersScreen();
    },
    [closeFiltersScreen],
  );
  const handleShortcutSelect = useCallback(
    (shortcut: FilterShortcut) => {
      if (shortcut.type === "players") {
        setFilters((prev) => ({
          ...prev,
          playersRange: shortcut.value as PlayersRangeOption,
        }));
        return;
      }
      if (shortcut.type === "duration") {
        setFilters((prev) => ({
          ...prev,
          durationRange: shortcut.value as DurationRangeOption,
        }));
        return;
      }
      if (shortcut.type === "price") {
        const max = Number(shortcut.value);
        setFilters((prev) => ({
          ...prev,
          priceMin: undefined,
          priceMax: max,
        }));
        return;
      }
      searchByCategory(shortcut.query);
    },
    [searchByCategory],
  );
  const discoveryItems = useMemo(() => {
    const categoryItems = primaryCategories.map((category, index) => ({
      id: `category-${category.id}`,
      title: category.name,
      icon: category.icon,
      gradient: getGradient(index),
      action: () => searchByCategory(category.query ?? category.name),
    }));
    const shortcutItems = filterShortcuts.map((shortcut, index) => ({
      id: `shortcut-${shortcut.id}`,
      title: shortcut.name,
      icon: shortcut.icon,
      gradient: getGradient(index + categoryItems.length),
      action: () => handleShortcutSelect(shortcut),
    }));
    return [...categoryItems, ...shortcutItems];
  }, [handleShortcutSelect, searchByCategory]);

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
  const todayDate = useMemo(() => new Date(), []);
  const todayIso = useMemo(
    () => todayDate.toISOString().split("T")[0],
    [todayDate],
  );
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("es-UY", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(todayDate),
    [todayDate],
  );
  const availableTodayGames = useMemo(
    () => allGames.filter((game) => isGameAvailable(game, todayIso, todayIso)),
    [allGames, todayIso],
  );

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilters((prev) =>
        prev.onlyAvailableInDates
          ? { ...prev, onlyAvailableInDates: false }
          : prev,
      );
    }
  }, [startDate, endDate]);
  const showAvailableTodayList = useCallback(() => {
    setFilters(buildDefaultFilters());
    setSortOption("availability");
    setQuery("");
    setDates(todayIso, todayIso);
  }, [setDates, setFilters, setQuery, setSortOption, todayIso]);

  // Runs the same filtering steps shown in the UI:
  // 1) match texto de búsqueda, 2) limitar por jugadores,
  // 3) duración, 4) precio por día, 5) dificultad,
  // 6) tipo de experiencia, 7) disponibilidad por fechas
  // y 8) valoración mínima.
  const filterByCriteria = useCallback(
    (criteria: FiltersState) => {
      const normalized = query ? normalizeText(query) : "";
      const matchesText = (game: Game) =>
        normalized
          ? [
              game.title,
              game.category,
              game.description,
              game.players,
              game.duration,
              game.difficulty,
            ].some((field) => normalizeText(field).includes(normalized))
          : true;

      return allGames.filter((game) => {
        if (!matchesText(game)) return false;

        const playersConfig = playersRangeOptions.find(
          (opt) => opt.id === criteria.playersRange,
        );
        if (playersConfig && playersConfig.id !== "any") {
          const range = parsePlayersRange(game.players);
          const configMin = playersConfig.min ?? 0;
          const configMax = playersConfig.max ?? Number.POSITIVE_INFINITY;
          const gameMin = range.min ?? range.max;
          const gameMax = range.max ?? range.min;
          if (
            gameMin === undefined ||
            gameMax === undefined ||
            gameMax < configMin ||
            gameMin > configMax
          ) {
            return false;
          }
        }

        const durationConfig = durationFilterOptions.find(
          (opt) => opt.id === criteria.durationRange,
        );
        if (durationConfig && durationConfig.id !== "any") {
          const minutes = parseDurationMinutes(game.duration);
          if (!minutes) return false;
          if (
            (durationConfig.minMinutes &&
              minutes < durationConfig.minMinutes) ||
            (durationConfig.maxMinutes && minutes > durationConfig.maxMinutes)
          ) {
            return false;
          }
        }

        if (
          typeof criteria.priceMin === "number" &&
          game.price < criteria.priceMin
        ) {
          return false;
        }
        if (
          typeof criteria.priceMax === "number" &&
          game.price > criteria.priceMax
        ) {
          return false;
        }

        if (criteria.difficulty !== "any") {
          const normalizedDifficulty = normalizeText(game.difficulty);
          if (!normalizedDifficulty.includes(criteria.difficulty)) {
            return false;
          }
        }

        if (criteria.experienceTypes.length > 0) {
          const categoryNormalized = normalizeText(game.category);
          const matchesExperience = criteria.experienceTypes.some((type) =>
            categoryNormalized.includes(normalizeText(type)),
          );
          if (!matchesExperience) return false;
        }

        if (
          criteria.onlyAvailableInDates &&
          startDate &&
          endDate &&
          !isGameAvailable(game, startDate, endDate)
        ) {
          return false;
        }

        if (
          criteria.minRating !== null &&
          typeof criteria.minRating === "number" &&
          game.rating < criteria.minRating
        ) {
          return false;
        }

        return true;
      });
    },
    [allGames, query, startDate, endDate],
  );

  const filteredGames = useMemo(() => {
    const baseList = filterByCriteria(filters);
    const sorted = [...baseList];
    switch (sortOption) {
      case "price":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "duration": {
        sorted.sort((a, b) => {
          const minutesA =
            parseDurationMinutes(a.duration) ?? Number.MAX_SAFE_INTEGER;
          const minutesB =
            parseDurationMinutes(b.duration) ?? Number.MAX_SAFE_INTEGER;
          return minutesA - minutesB;
        });
        break;
      }
      case "availability":
      default:
        if (startDate && endDate) {
          sorted.sort((a, b) => {
            const availB = isGameAvailable(b, startDate, endDate) ? 1 : 0;
            const availA = isGameAvailable(a, startDate, endDate) ? 1 : 0;
            if (availB === availA) return 0;
            return availB - availA;
          });
        }
        break;
    }
    return sorted;
  }, [filterByCriteria, filters, sortOption, startDate, endDate]);

  const getPreviewCount = useCallback(
    (candidate: FiltersState) => filterByCriteria(candidate).length,
    [filterByCriteria],
  );

  useEffect(() => {
    if (!randomPickToken) return;
    const pool = filteredGames.length ? filteredGames : allGames;
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSurpriseGame(pick);
    navigate(`/product/${pick.id}`);
  }, [randomPickToken, filteredGames, allGames, navigate]);

  const dateFilterActive = Boolean(startDate && endDate);
  const trimmedQuery = query.trim();
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.playersRange !== "any") count++;
    if (filters.durationRange !== "any") count++;
    if (typeof filters.priceMin === "number") count++;
    if (typeof filters.priceMax === "number") count++;
    if (filters.difficulty !== "any") count++;
    if (filters.experienceTypes.length) count++;
    if (filters.onlyAvailableInDates) count++;
    if (filters.minRating !== null) count++;
    return count;
  }, [filters]);
  const filtersApplied = activeFiltersCount > 0;
  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];

    if (filters.playersRange !== "any") {
      const label = playersRangeChipLabels[filters.playersRange];
      if (label) {
        chips.push({
          key: "players",
          label,
          onClear: () =>
            setFilters((prev) => ({ ...prev, playersRange: "any" })),
        });
      }
    }

    if (filters.durationRange !== "any") {
      const label = durationRangeChipLabels[filters.durationRange];
      if (label) {
        chips.push({
          key: "duration",
          label,
          onClear: () =>
            setFilters((prev) => ({ ...prev, durationRange: "any" })),
        });
      }
    }

    if (
      typeof filters.priceMin === "number" &&
      typeof filters.priceMax === "number"
    ) {
      chips.push({
        key: "price-range",
        label: `Entre ${formatUYU(filters.priceMin)} y ${formatUYU(
          filters.priceMax,
        )}`,
        onClear: () =>
          setFilters((prev) => ({
            ...prev,
            priceMin: undefined,
            priceMax: undefined,
          })),
      });
    } else if (typeof filters.priceMin === "number") {
      chips.push({
        key: "price-min",
        label: `Desde ${formatUYU(filters.priceMin)}`,
        onClear: () =>
          setFilters((prev) => ({
            ...prev,
            priceMin: undefined,
          })),
      });
    } else if (typeof filters.priceMax === "number") {
      chips.push({
        key: "price-max",
        label: `Hasta ${formatUYU(filters.priceMax)}`,
        onClear: () =>
          setFilters((prev) => ({
            ...prev,
            priceMax: undefined,
          })),
      });
    }

    if (filters.difficulty !== "any") {
      const label = difficultyChipLabels[filters.difficulty];
      if (label) {
        chips.push({
          key: "difficulty",
          label: `Dificultad: ${label}`,
          onClear: () => setFilters((prev) => ({ ...prev, difficulty: "any" })),
        });
      }
    }

    if (filters.experienceTypes.length > 0) {
      filters.experienceTypes.forEach((type) => {
        chips.push({
          key: `experience-${type}`,
          label: type,
          onClear: () =>
            setFilters((prev) => ({
              ...prev,
              experienceTypes: prev.experienceTypes.filter(
                (experience) => experience !== type,
              ),
            })),
        });
      });
    }

    if (filters.onlyAvailableInDates) {
      chips.push({
        key: "availability",
        label: "Solo disponibles en mis fechas",
        onClear: () =>
          setFilters((prev) => ({ ...prev, onlyAvailableInDates: false })),
      });
    }

    if (filters.minRating !== null) {
      chips.push({
        key: "rating",
        label: `Desde ${filters.minRating.toFixed(1)}★`,
        onClear: () =>
          setFilters((prev) => ({
            ...prev,
            minRating: null,
          })),
      });
    }

    return chips;
  }, [filters, setFilters]);
  const isResultsMode = Boolean(
    trimmedQuery || dateFilterActive || selectedCategory || filtersApplied,
  );
  const noResults = filteredGames.length === 0;
  const resultsTitle = selectedCategory
    ? `Juegos de ${selectedCategory}`
    : trimmedQuery
      ? `Resultados para “${trimmedQuery}”`
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
      description: "Opciones para quienes buscan desafíos bien profundos.",
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
  const [featuredSection, ...additionalSections] = curatedSections;

  return (
    <section className="px-4 sm:px-8 py-6 sm:py-10 space-y-5">
      {!isResultsMode && (
        <>
          <header className="space-y-3">
            <p className="text-md uppercase tracking-wide text-game-brown/90 font-semibold">
              Descubrí tu próximo juego
            </p>
          </header>

          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-game-rust font-semibold">
                  Explorá por categoría
                </p>
              </div>
            </div>
            <div className="overflow-x-auto pb-4 -mx-1 px-1">
              <div className="flex gap-2 snap-x snap-mandatory">
                {discoveryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/60 px-3 py-3 shadow-sm hover:shadow-md transition flex-shrink-0 w-28 snap-start bg-gradient-to-br text-game-brown",
                      item.gradient,
                    )}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-inner">
                      {item.icon}
                    </span>
                    <p className="text-xs font-semibold text-center text-game-brown">
                      {item.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {featuredSection ? (
            <SectionBlock
              key={featuredSection.key}
              title={featuredSection.title}
              description={featuredSection.description}
              games={featuredSection.games}
              variant={featuredSection.variant}
            />
          ) : null}

          {availableTodayGames.length > 0 && (
            <section className="space-y-4" aria-label="¡Alquilá para hoy!">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-game-brown">
                    ¡Alquilá para hoy!
                  </h2>
                  <p className="text-game-brown/70 text-sm">
                    {`Listos para ${todayLabel.toLowerCase()}.`}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={showAvailableTodayList}
                    className="inline-flex items-center gap-2 rounded-full border border-game-brown/30 px-4 py-2 text-sm font-semibold text-game-brown hover:border-game-brown/60 transition whitespace-nowrap"
                  >
                    Ver más
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
                {availableTodayGames.slice(0, 8).map((game) => (
                  <div className="snap-start flex-shrink-0 w-72" key={game.id}>
                    <GameCard
                      game={game}
                      variant="tall"
                      highlightAvailability
                      startDate={todayIso}
                      endDate={todayIso}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

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

          {additionalSections.map((section) => (
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

      {isResultsMode && (
        <>
          {noResults ? (
            <EmptyResultsState
              title="No encontramos juegos con estos filtros."
              description="Probá cambiar las fechas o borrar algunos filtros."
              onChangeDates={() => openSearchPanel("dates")}
              onClearFilters={clearFiltersPreservingQuery}
            />
          ) : (
            <section className="space-y-5" aria-label={resultsTitle}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Link
                      to="/"
                      onClick={handleResetAll}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-game-brown/30 text-game-brown hover:border-game-brown transition-colors"
                      aria-label="Volver al inicio"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <h2 className="text-2xl font-semibold text-game-brown">
                          {resultsTitle}
                        </h2>
                        <span className="text-sm text-game-brown/60">
                          {filteredGames.length}{" "}
                          {filteredGames.length === 1 ? "juego" : "juegos"}
                        </span>
                      </div>
                      {dateFilterActive ? (
                        <p className="text-sm text-game-brown/70 mt-1">
                          Ordenamos primero los disponibles en tus fechas.
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openSearchPanel("dates")}
                          className="text-sm font-semibold text-red-600 underline decoration-dotted underline-offset-4 mt-1"
                        >
                          Agregá fechas para ver disponibilidad exacta
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-game-brown/70 underline decoration-dotted underline-offset-4 self-start lg:self-auto"
                    onClick={handleResetAll}
                  >
                    Borrar búsqueda
                  </button>
                </div>
                {filtersApplied && activeFilterChips.length > 0 && (
                  <div className="flex flex-nowrap gap-2 mt-1 overflow-x-auto pb-1 pr-1">
                    {activeFilterChips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={chip.onClear}
                        className="px-3 py-1 rounded-full border border-game-brown/20 bg-white text-xs text-game-brown/80 flex items-center gap-1 shadow-sm whitespace-nowrap"
                        aria-label={`Quitar filtro ${chip.label}`}
                      >
                        <span className="truncate">{chip.label}</span>
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="sticky top-0 z-10 bg-amber-100/95 pt-2 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openFiltersScreen}
                    className={cn(
                      "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition",
                      filtersApplied
                        ? "border-game-rust bg-white text-game-brown shadow"
                        : "border-game-brown/20 bg-white text-game-brown hover:border-game-brown/40 shadow-sm",
                    )}
                    title={
                      filtersApplied
                        ? `Filtros activos (${activeFiltersCount})`
                        : "Abrí los filtros"
                    }
                  >
                    <ListFilter className="w-4 h-4" aria-hidden="true" />
                    <span className="truncate">
                      {filtersApplied
                        ? `Filtros (${activeFiltersCount})`
                        : "Filtros"}
                    </span>
                  </button>
                  <SortMenu value={sortOption} onChange={setSortOption} />
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    highlightAvailability={dateFilterActive}
                    startDate={startDate}
                    endDate={endDate}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
      {isFiltersOpen && (
        <FiltersModal
          isOpen={isFiltersOpen}
          filters={filters}
          onClose={closeFiltersScreen}
          onApply={applyFiltersFromModal}
          dateFilterActive={dateFilterActive}
          getPreviewCount={getPreviewCount}
          buildDefaultFilters={buildDefaultFilters}
        />
      )}
    </section>
  );
}

interface EmptyResultsStateProps {
  title: string;
  description: string;
  onChangeDates: () => void;
  onClearFilters: () => void;
}

function EmptyResultsState({
  title,
  description,
  onChangeDates,
  onClearFilters,
}: EmptyResultsStateProps) {
  return (
    <div className="rounded-3xl bg-white border border-dashed border-game-brown/40 p-8 text-center space-y-4 shadow-sm">
      <p className="text-xl font-semibold text-game-brown">{title}</p>
      <p className="text-game-brown/70">{description}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          className="px-5 py-3 rounded-full bg-game-rust text-white font-semibold shadow hover:opacity-95 transition"
          onClick={onChangeDates}
        >
          Cambiá las fechas
        </button>
        <button
          type="button"
          className="px-5 py-3 rounded-full border border-game-brown/30 text-game-brown font-semibold hover:border-game-brown/60 transition"
          onClick={onClearFilters}
        >
          Borrá filtros
        </button>
      </div>
    </div>
  );
}

interface SortMenuProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

function SortMenu({ value, onChange }: SortMenuProps) {
  const labels: Record<SortOption, string> = {
    availability: "Disponibilidad",
    price: "Precio más bajo",
    rating: "Mejor valoración",
    duration: "Partidas cortas",
  };

  const currentLabel = labels[value];
  const isDefaultSort = value === "availability";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white text-game-brown transition",
            isDefaultSort
              ? "border-game-brown/20 shadow-sm hover:border-game-brown/40"
              : "border-game-rust text-game-rust shadow",
          )}
          title={`Ordenar por ${currentLabel}`}
        >
          <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">{`Ordenar: ${currentLabel}`}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {(Object.entries(labels) as Array<[SortOption, string]>).map(
          ([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onChange(key as SortOption)}
              className="flex items-center gap-2"
            >
              <Check
                className={cn(
                  "h-4 w-4 text-game-rust",
                  value === key ? "opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              />
              <span>{label}</span>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface FiltersModalProps {
  isOpen: boolean;
  filters: FiltersState;
  onClose: () => void;
  onApply: (filters: FiltersState) => void;
  dateFilterActive: boolean;
  getPreviewCount: (filters: FiltersState) => number;
  buildDefaultFilters: () => FiltersState;
}

function FiltersModal({
  isOpen,
  filters,
  onClose,
  onApply,
  dateFilterActive,
  getPreviewCount,
  buildDefaultFilters,
}: FiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<FiltersState>(filters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [filters, isOpen]);

  const previewCount = useMemo(
    () => getPreviewCount(localFilters),
    [getPreviewCount, localFilters],
  );

  useEffect(() => {
    if (!dateFilterActive && localFilters.onlyAvailableInDates) {
      setLocalFilters((prev) =>
        prev.onlyAvailableInDates
          ? { ...prev, onlyAvailableInDates: false }
          : prev,
      );
    }
  }, [dateFilterActive, localFilters.onlyAvailableInDates]);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    setLocalFilters(buildDefaultFilters());
  };

  const updatePrice = (field: "priceMin" | "priceMax", value: string) => {
    const trimmed = value.trim();
    if (trimmed === "") {
      setLocalFilters((prev) => ({ ...prev, [field]: undefined }));
      return;
    }
    const parsed = Number(trimmed);
    setLocalFilters((prev) => ({
      ...prev,
      [field]: Number.isNaN(parsed) ? undefined : Math.max(0, parsed),
    }));
  };

  const toggleExperience = (value: string) => {
    setLocalFilters((prev) => {
      const exists = prev.experienceTypes.includes(value);
      return {
        ...prev,
        experienceTypes: exists
          ? prev.experienceTypes.filter((item) => item !== value)
          : [...prev.experienceTypes, value],
      };
    });
  };

  const setPlayersRange = (value: PlayersRangeOption) =>
    setLocalFilters((prev) => ({ ...prev, playersRange: value }));
  const setDurationRange = (value: DurationRangeOption) =>
    setLocalFilters((prev) => ({ ...prev, durationRange: value }));
  const setDifficulty = (value: DifficultyFilterValue) =>
    setLocalFilters((prev) => ({ ...prev, difficulty: value }));
  const toggleOnlyAvailableInDates = () =>
    setLocalFilters((prev) => ({
      ...prev,
      onlyAvailableInDates: !prev.onlyAvailableInDates,
    }));
  const setMinRating = (value: number | null) =>
    setLocalFilters((prev) => ({
      ...prev,
      minRating: value,
    }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-stretch justify-center p-0 sm:p-6">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-3xl sm:rounded-3xl shadow-2xl flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-game-brown/10">
          <button
            type="button"
            className="text-sm font-semibold text-game-brown underline decoration-dotted underline-offset-4"
            onClick={onClose}
          >
            Cerrar
          </button>
          <p className="text-base font-semibold text-game-brown">Filtros</p>
          <button
            type="button"
            className="text-sm font-semibold text-game-rust underline decoration-dotted underline-offset-4"
            onClick={handleClear}
          >
            Borrá todo
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <ModalSection title="Jugadores">
              <div className="flex flex-wrap gap-2">
                {playersRangeOptions.map((option) => (
                  <SelectableChip
                    key={option.id}
                    label={option.label}
                    active={localFilters.playersRange === option.id}
                    onClick={() => setPlayersRange(option.id)}
                  />
                ))}
              </div>
            </ModalSection>
          </div>

          <div>
            <ModalSection title="Duración">
              <div className="flex flex-wrap gap-2">
                {durationFilterOptions.map((option) => (
                  <SelectableChip
                    key={option.id}
                    label={option.label}
                    active={localFilters.durationRange === option.id}
                    onClick={() => setDurationRange(option.id)}
                  />
                ))}
              </div>
            </ModalSection>
          </div>

          <div>
            <ModalSection
              title="Precio por día"
              description="Filtrá por precio de alquiler por día."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm text-game-brown">
                  Mínimo (UYU)
                  <input
                    type="number"
                    min={0}
                    className="rounded-2xl border border-game-brown/20 bg-white px-4 py-2 shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                    value={localFilters.priceMin ?? ""}
                    onChange={(event) =>
                      updatePrice("priceMin", event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-game-brown">
                  Máximo (UYU)
                  <input
                    type="number"
                    min={0}
                    className="rounded-2xl border border-game-brown/20 bg-white px-4 py-2 shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                    value={localFilters.priceMax ?? ""}
                    onChange={(event) =>
                      updatePrice("priceMax", event.target.value)
                    }
                  />
                </label>
              </div>
            </ModalSection>
          </div>

          <div>
            <ModalSection title="Dificultad">
              <div className="flex flex-wrap gap-2">
                {difficultyOptions.map((option) => (
                  <SelectableChip
                    key={option.id}
                    label={option.label}
                    active={localFilters.difficulty === option.id}
                    onClick={() => setDifficulty(option.id)}
                  />
                ))}
              </div>
            </ModalSection>
          </div>

          <div>
            <ModalSection title="Tipo de experiencia">
              <div className="flex flex-wrap gap-2">
                {experienceOptions.map((option) => (
                  <SelectableChip
                    key={option.id}
                    label={option.label}
                    active={localFilters.experienceTypes.includes(option.id)}
                    onClick={() => toggleExperience(option.id)}
                    variant="outline"
                  />
                ))}
              </div>
            </ModalSection>
          </div>

          <div>
            <ModalSection title="Otros">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-game-brown/10 px-4 py-3 bg-amber-50/60">
                  <div>
                    <p className="text-sm font-semibold text-game-brown">
                      Solo disponibles en mis fechas
                    </p>
                    <p className="text-xs text-game-brown/70">
                      {dateFilterActive
                        ? "Mostramos únicamente los juegos con cupo libre."
                        : "Agregá fechas para activar este filtro."}
                    </p>
                  </div>
                  <Switch
                    checked={
                      localFilters.onlyAvailableInDates && dateFilterActive
                    }
                    disabled={!dateFilterActive}
                    onCheckedChange={() => {
                      if (!dateFilterActive) return;
                      toggleOnlyAvailableInDates();
                    }}
                  />
                </div>
                <div className="rounded-2xl border border-game-brown/10 px-4 py-3">
                  <p className="text-sm font-semibold text-game-brown">
                    Valoración mínima
                  </p>
                  <p className="text-xs text-game-brown/70">
                    Mostramos juegos con puntaje igual o superior al
                    seleccionado.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ratingOptions.map((option) => (
                      <SelectableChip
                        key={option.label}
                        label={option.label}
                        active={localFilters.minRating === option.id}
                        onClick={() => setMinRating(option.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ModalSection>
          </div>
        </div>

        <footer className="border-t border-game-brown/10 px-6 py-4 space-y-2 bg-white/90">
          <p className="text-sm text-game-brown/70">
            {previewCount === 1
              ? "Se encontró 1 juego"
              : `Se encontraron ${previewCount} juegos`}
          </p>
          <button
            type="button"
            className="w-full rounded-full bg-game-rust text-white font-semibold py-3 shadow-lg hover:opacity-95 transition"
            onClick={handleApply}
          >
            Ver resultados
          </button>
        </footer>
      </div>
    </div>
  );
}

function ModalSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-base font-semibold text-game-brown">{title}</p>
        {description ? (
          <p className="text-sm text-game-brown/70">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SelectableChip({
  label,
  active,
  onClick,
  variant = "solid",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full border text-sm font-medium transition",
        variant === "outline" && !active
          ? "border-game-brown/30 text-game-brown/80 hover:border-game-brown/60 bg-white"
          : active
            ? "border-game-rust bg-amber-50 text-game-brown"
            : "border-game-brown/20 text-game-brown/70 hover:border-game-brown/40 bg-white",
      )}
    >
      {label}
    </button>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-game-brown">{title}</h2>
          <p className="text-game-brown/70 text-sm">{description}</p>
        </div>
        {action ? <div className="flex-shrink-0">{action}</div> : null}
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
  const rangeInfo = availabilityLabel(game, startDate, endDate);

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

          <div className="space-y-3 mt-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-game-brown/60 uppercase tracking-wide">
                  Desde
                </p>
                <div className="inline-flex items-baseline gap-1 text-game-brown whitespace-nowrap">
                  <span className="text-lg sm:text-xl font-semibold">
                    {formatUYU(game.price)}
                  </span>
                  <span className="text-sm font-medium text-game-brown/70">
                    / día
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-game-rust">
                Ver detalles y alquilar
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>

            {showRangeMessage ? (
              <div
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-2xl px-3 py-2 text-sm font-semibold",
                  availableForRange
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600",
                )}
              >
                <p className="flex items-center gap-2 text-base font-semibold">
                  {availableForRange ? (
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                  )}
                  {availableForRange
                    ? "Disponible en tus fechas"
                    : "No disponible en tus fechas"}
                </p>
                <p className="text-[11px] font-medium text-game-brown/70">
                  {rangeInfo}
                </p>
              </div>
            ) : (
              <p className="text-xs text-game-brown/60">{rangeInfo}</p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
