import {
  Dice6,
  Home,
  Plus,
  Search as SearchIcon,
  User,
  X,
  CalendarRange,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export type SearchState = {
  query: string;
  startDate?: string;
  endDate?: string;
  randomPickToken: number;
  selectedCategory?: string;
};

interface SearchContextValue extends SearchState {
  setQuery: (value: string) => void;
  setDates: (startDate?: string, endDate?: string) => void;
  clearSearch: () => void;
  triggerRandomPick: () => void;
  searchByCategory: (category: string) => void;
  openSearchPanel: (focusTarget?: "query" | "dates") => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const useSearchContext = (): SearchContextValue => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext debe usarse dentro de Layout");
  }
  return ctx;
};

const formatRangeLabel = (start?: string, end?: string) => {
  if (!start || !end) return "Fechas flexibles";
  try {
    const formatter = new Intl.DateTimeFormat("es-UY", {
      month: "short",
      day: "numeric",
    });
    const from = formatter.format(new Date(start));
    const to = formatter.format(new Date(end));
    return `${from} – ${to}`;
  } catch {
    return "Fechas seleccionadas";
  }
};

const suggestions = [
  { label: "Cooperativos para 4 jugadores", query: "Cooperativo" },
  { label: "Para jugar en familia", query: "Familiar" },
  { label: "Juegos de fiesta", query: "Fiesta" },
  { label: "Desafíos expertos", query: "Experto" },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    randomPickToken: 0,
    selectedCategory: undefined,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelQuery, setPanelQuery] = useState("");
  const [panelStartDate, setPanelStartDate] = useState("");
  const [panelEndDate, setPanelEndDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [panelFocusTarget, setPanelFocusTarget] = useState<
    "query" | "dates" | null
  >(null);
  const [panelDatesError, setPanelDatesError] = useState("");
  const panelQueryInputRef = useRef<HTMLInputElement | null>(null);
  const panelStartDateRef = useRef<HTMLInputElement | null>(null);
  const panelEndDateRef = useRef<HTMLInputElement | null>(null);

  const setQuery = useCallback((value: string) => {
    setSearchState((prev) => ({
      ...prev,
      query: value,
      selectedCategory: undefined,
    }));
  }, []);

  const setDates = useCallback((startDate?: string, endDate?: string) => {
    setSearchState((prev) => ({ ...prev, startDate, endDate }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState((prev) => ({
      ...prev,
      query: "",
      startDate: undefined,
      endDate: undefined,
      selectedCategory: undefined,
    }));
  }, []);

  const triggerRandomPick = useCallback(() => {
    setSearchState((prev) => ({
      ...prev,
      randomPickToken: prev.randomPickToken + 1,
    }));
  }, []);

  const searchByCategory = useCallback((category: string) => {
    const value = category.trim();
    if (!value) return;
    setSearchState((prev) => ({
      ...prev,
      query: value,
      selectedCategory: value,
    }));
    setIsPanelOpen(false);
  }, []);

  const openSearchPanel = useCallback(
    (focusTarget: "query" | "dates" = "query") => {
      setPanelFocusTarget(focusTarget);
      setIsPanelOpen(true);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      ...searchState,
      setQuery,
      setDates,
      clearSearch,
      triggerRandomPick,
      searchByCategory,
      openSearchPanel,
    }),
    [
      searchState,
      setQuery,
      setDates,
      clearSearch,
      triggerRandomPick,
      searchByCategory,
      openSearchPanel,
    ],
  );

  useEffect(() => {
    if (isPanelOpen) {
      setPanelQuery(searchState.query);
      setPanelStartDate(searchState.startDate ?? "");
      setPanelEndDate(searchState.endDate ?? "");
      setPanelDatesError("");
    }
  }, [
    isPanelOpen,
    searchState.query,
    searchState.startDate,
    searchState.endDate,
  ]);

  useEffect(() => {
    if (!isPanelOpen) {
      setPanelFocusTarget(null);
      return;
    }
    const frame = requestAnimationFrame(() => {
      if (panelFocusTarget === "dates") {
        panelStartDateRef.current?.focus() ??
          panelEndDateRef.current?.focus() ??
          panelQueryInputRef.current?.focus();
        return;
      }
      panelQueryInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isPanelOpen, panelFocusTarget]);

  const applyFilters = useCallback(
    (customQuery?: string, customDates?: { start?: string; end?: string }) => {
      const sourceQuery = (customQuery ?? panelQuery).trim();
      const sourceStart = customDates?.start ?? panelStartDate;
      const sourceEnd = customDates?.end ?? panelEndDate;
      setQuery(sourceQuery);
      if (sourceStart && sourceEnd) {
        setDates(sourceStart, sourceEnd);
      } else {
        setDates(undefined, undefined);
      }
    },
    [panelQuery, panelStartDate, panelEndDate, setQuery, setDates],
  );

  const applyCurrentFilters = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  const validatePanelDates = useCallback(() => {
    const hasStart = Boolean(panelStartDate);
    const hasEnd = Boolean(panelEndDate);
    if ((hasStart && !hasEnd) || (!hasStart && hasEnd)) {
      setPanelDatesError(
        "Ingresá una fecha de inicio y de fin para continuar.",
      );
      return false;
    }
    if (hasStart && hasEnd) {
      const start = Date.parse(panelStartDate);
      const end = Date.parse(panelEndDate);
      if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
        setPanelDatesError(
          "La fecha de fin tiene que ser posterior a la de inicio.",
        );
        return false;
      }
    }
    setPanelDatesError("");
    return true;
  }, [panelStartDate, panelEndDate]);

  const runSearchAndNavigate = useCallback(() => {
    setPanelDatesError("");
    setIsPanelOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!validatePanelDates()) return;
    applyCurrentFilters();
    runSearchAndNavigate();
  };

  const handleClearAll = () => {
    setPanelQuery("");
    setPanelStartDate("");
    setPanelEndDate("");
    setPanelDatesError("");
    clearSearch();
  };

  const handleSurprise = () => {
    if (!validatePanelDates()) return;
    applyCurrentFilters();
    triggerRandomPick();
    runSearchAndNavigate();
  };

  const handleSuggestionClick = (value: string) => {
    setPanelQuery(value);
    if (!validatePanelDates()) return;
    applyFilters(value);
    runSearchAndNavigate();
  };

  const goHome = useCallback(() => {
    setIsPanelOpen(false);
    navigate("/");
  }, [navigate]);

  const activeQueryLabel = searchState.query.trim();
  const collapsedDates = formatRangeLabel(
    searchState.startDate,
    searchState.endDate,
  );
  const querySummary = searchState.selectedCategory
    ? searchState.selectedCategory
    : activeQueryLabel
      ? `“${activeQueryLabel}”`
      : undefined;
  const pillSecondaryText =
    [querySummary, collapsedDates].filter(Boolean).join(" · ") ||
    collapsedDates;

  const isActive = (path: string) => location.pathname === path;
  const hideBottomNav = /^\/product\/\d+(?:\/.*)?$/.test(location.pathname);
  const hideHeader = /^\/product\/\d+(?:\/.*)?$/.test(location.pathname);

  return (
    <SearchContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-game-cream to-amber-50 flex flex-col">
        {!hideHeader && (
          <header
            className="sticky top-0 z-40 bg-white shadow-md border-b-4 border-game-rust"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <div className="px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goHome}
                  className="flex items-center focus:outline-none"
                  aria-label="Ir al inicio"
                >
                  <img
                    src="https://images.vexels.com/media/users/3/189702/isolated/preview/0909c4a72562b45eb247012f1606c4c6-icono-de-juguete-de-dados.png"
                    alt="App Logo"
                    className="h-8 sm:h-10 w-auto"
                  />
                </button>

                <button
                  type="button"
                  className="flex-1 max-w-lg flex items-center justify-between gap-4 bg-white rounded-full border border-game-brown/20 shadow-md px-4 py-2 transition hover:shadow-lg"
                  onClick={() => openSearchPanel("query")}
                  aria-label="Abrir búsqueda"
                >
                  <div className="text-left w-full">
                    <p className="text-sm font-semibold text-game-brown">
                      Buscá un juego de mesa
                    </p>
                    <p className="text-xs text-game-brown/70 mt-1 line-clamp-1">
                      {pillSecondaryText}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-game-rust text-white">
                    <SearchIcon className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-game-brown border-opacity-20 bg-white">
                <nav className="flex flex-col gap-1 px-4 py-3">
                  <Link
                    to="/"
                    className={`px-4 py-2 rounded-lg transition ${
                      isActive("/")
                        ? "bg-game-rust text-white"
                        : "hover:bg-game-cream text-game-brown"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/product/1"
                    className={`px-4 py-2 rounded-lg transition ${
                      isActive("/product/1")
                        ? "bg-game-rust text-white"
                        : "hover:bg-game-cream text-game-brown"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Productos
                  </Link>
                </nav>
              </div>
            )}
          </header>
        )}

        <main className="flex-1 w-full">{children}</main>

        {/* Bottom Navigation (hidden on product detail) */}
        {!hideBottomNav && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-4 border-game-rust shadow-2xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex justify-around">
              <Link
                to="/"
                className={`flex flex-col items-center justify-center flex-1 py-2 sm:py-3 transition ${
                  isActive("/")
                    ? "text-game-rust"
                    : "text-game-brown hover:text-game-rust"
                }`}
              >
                <Home className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                <span className="text-xs font-medium">Inicio</span>
              </Link>
              <button className="flex flex-col items-center justify-center flex-1 py-2 sm:py-3 transition text-game-brown hover:text-game-rust">
                <Dice6 className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                <span className="text-xs font-medium">Mis Juegos</span>
              </button>
              <Link
                to="/"
                className="flex flex-col items-center justify-center flex-1 py-2 sm:py-3 transition text-game-brown hover:text-game-rust"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                <span className="text-xs font-medium">Publicar</span>
              </Link>
              <button className="flex flex-col items-center justify-center flex-1 py-2 sm:py-3 transition text-game-brown hover:text-game-rust">
                <User className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </nav>
        )}

        {/* Search Panel Modal */}
        {isPanelOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start sm:items-center p-2 sm:p-6">
            <form
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4"
              onSubmit={handleSearchSubmit}
            >
              <div className="px-6 py-5 space-y-6 max-h-[80vh] overflow-y-auto">
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm uppercase tracking-wide text-game-brown/60 font-semibold">
                      Buscá juegos
                    </p>
                    <button
                      type="button"
                      className="rounded-full p-2 hover:bg-slate-100"
                      onClick={() => setIsPanelOpen(false)}
                      aria-label="Cerrar panel de búsqueda"
                    >
                      <X className="w-5 h-5 text-game-brown" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-game-brown/20 px-4 py-3 shadow-inner bg-white">
                    <SearchIcon className="w-5 h-5 text-game-brown/70" />
                    <input
                      ref={panelQueryInputRef}
                      className="flex-1 outline-none text-game-brown placeholder:text-game-brown/50"
                      placeholder="Buscá por nombre, categoría o mecánica"
                      autoComplete="off"
                      value={panelQuery}
                      onChange={(e) => setPanelQuery(e.target.value)}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleSuggestionClick(item.query)}
                        className="flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm text-game-brown transition hover:bg-amber-100"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-game-brown/60 font-semibold">
                        Fechas
                      </p>
                      <p className="text-base text-game-brown">
                        {panelStartDate && panelEndDate
                          ? formatRangeLabel(panelStartDate, panelEndDate)
                          : "Agregá fechas cuando quieras"}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-game-brown/70">
                      <CalendarRange className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Agregá tus días
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-game-brown/20 p-4 bg-amber-50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-game-brown">
                          Fecha de inicio
                        </label>
                        <input
                          type="date"
                          ref={panelStartDateRef}
                          value={panelStartDate}
                          onChange={(e) => {
                            setPanelStartDate(e.target.value);
                            setPanelDatesError("");
                          }}
                          max={panelEndDate || undefined}
                          className="w-full rounded-2xl border border-game-brown/20 bg-white px-4 py-3 text-game-brown shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-game-brown">
                          {panelStartDate ? "Fecha de fin" : "Fecha de fin"}
                        </label>
                        <input
                          type="date"
                          ref={panelEndDateRef}
                          value={panelEndDate}
                          onChange={(e) => {
                            setPanelEndDate(e.target.value);
                            setPanelDatesError("");
                          }}
                          min={panelStartDate || undefined}
                          className="w-full rounded-2xl border border-game-brown/20 bg-white px-4 py-3 text-game-brown shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                      <p className="text-xs text-game-brown/70">
                        Agregá un rango para ver solo lo disponible en esos
                        días.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPanelStartDate("");
                          setPanelEndDate("");
                          setPanelDatesError("");
                        }}
                        className="text-xs font-semibold text-game-rust underline decoration-dotted underline-offset-4 hover:text-game-brown"
                      >
                        Reiniciá las fechas
                      </button>
                    </div>
                    {panelDatesError && (
                      <p className="text-xs font-semibold text-red-600">
                        {panelDatesError}
                      </p>
                    )}
                  </div>
                </section>

                <section className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-game-rust/30 text-game-rust font-semibold py-3 hover:bg-amber-50 transition"
                    onClick={handleSurprise}
                  >
                    <Dice6 className="w-5 h-5" />
                    Sorprendeme
                  </button>
                </section>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between px-6 py-4 border-t bg-white/80">
                <button
                  type="button"
                  className="text-sm font-semibold text-game-brown underline decoration-dotted underline-offset-4"
                  onClick={handleClearAll}
                >
                  Borrá todo
                </button>
                <div className="flex-1 w-full flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition w-full sm:w-auto"
                  >
                    <SearchIcon className="w-5 h-5" />
                    Buscá
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </SearchContext.Provider>
  );
}
