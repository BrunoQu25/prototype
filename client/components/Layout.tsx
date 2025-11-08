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
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const useSearchContext = (): SearchContextValue => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext debe usarse dentro de Layout");
  }
  return ctx;
};

const toISODate = (date?: Date) =>
  date ? date.toISOString().split("T")[0] : undefined;

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
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    randomPickToken: 0,
    selectedCategory: undefined,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelQuery, setPanelQuery] = useState("");
  const [panelRange, setPanelRange] = useState<DateRange | undefined>();
  const [calendarVisible, setCalendarVisible] = useState(false);

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

  const contextValue = useMemo(
    () => ({
      ...searchState,
      setQuery,
      setDates,
      clearSearch,
      triggerRandomPick,
      searchByCategory,
    }),
    [
      searchState,
      setQuery,
      setDates,
      clearSearch,
      triggerRandomPick,
      searchByCategory,
    ],
  );

  useEffect(() => {
    if (isPanelOpen) {
      setPanelQuery(searchState.query);
      if (searchState.startDate && searchState.endDate) {
        setPanelRange({
          from: new Date(searchState.startDate),
          to: new Date(searchState.endDate),
        });
        setCalendarVisible(true);
      } else {
        setPanelRange(undefined);
        setCalendarVisible(false);
      }
    }
  }, [
    isPanelOpen,
    searchState.query,
    searchState.startDate,
    searchState.endDate,
  ]);

  const applyFilters = useCallback(
    (customQuery?: string, customRange?: DateRange | undefined) => {
      const sourceQuery = (customQuery ?? panelQuery).trim();
      const sourceRange = customRange ?? panelRange;
      setQuery(sourceQuery);
      if (sourceRange?.from && sourceRange?.to) {
        setDates(toISODate(sourceRange.from), toISODate(sourceRange.to));
      } else {
        setDates(undefined, undefined);
      }
    },
    [panelQuery, panelRange, setQuery, setDates],
  );

  const applyCurrentFilters = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearchSubmit = () => {
    applyCurrentFilters();
    setIsPanelOpen(false);

    // ensure results are visible from any page
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleClearAll = () => {
    setPanelQuery("");
    setPanelRange(undefined);
    setCalendarVisible(false);
    clearSearch();
  };

  const handleSurprise = () => {
    applyCurrentFilters();
    triggerRandomPick();
    setIsPanelOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSuggestionClick = (value: string) => {
    setPanelQuery(value);
    applyFilters(value);
    setIsPanelOpen(false);
    if (location.pathname !== "/") navigate("/");
  };

  const goHome = useCallback(() => {
    setIsPanelOpen(false);
    navigate("/");
  }, [navigate]);

  const collapsedLabel = searchState.query
    ? searchState.query
    : "Comenzá a explorar juegos de mesa";
  const collapsedDates = formatRangeLabel(
    searchState.startDate,
    searchState.endDate,
  );

  const isActive = (path: string) => location.pathname === path; 
  const hideBottomNav = /^\/product\/\d+(?:\/.*)?$/.test(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-cream to-amber-50 flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-white shadow-md border-b-4 border-game-rust"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🎲</span>
              <span className="font-bold text-xl text-game-brown hidden sm:inline">
                Table Hopping
              </span>
              <span className="font-bold text-xl text-game-brown sm:hidden">
                TTQ
              </span>
            </Link>

            {/* Search Bar - Hidden on mobile. On product pages we collapse the central search (icon is in the right actions) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              {!hideBottomNav ? (
                <div className="w-full flex items-center bg-game-cream rounded-full px-4 py-2 border-2 border-game-brown border-opacity-20">
                  <span className="text-lg mr-2">🔍</span>
                  <input
                    type="text"
                    placeholder="Busca algo nuevo..."
                    className="bg-transparent outline-none w-full text-game-brown placeholder:text-game-brown placeholder:opacity-50"
                  />
                </div>
              ) : null}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Compact search icon on product pages (placed to the left of favorites) */}
              {hideBottomNav && (
                <button
                  onClick={() => setProductSearchOpen(true)}
                  aria-label="Abrir búsqueda"
                  title="Buscar"
                  className="p-2 hover:bg-game-cream rounded-lg transition text-game-brown"
                >
                  <span className="text-lg">🔍</span>
                </button>
              )}

              <button className="p-2 hover:bg-game-cream rounded-lg transition text-game-brown">
                <Heart className="w-5 h-5" />
    <SearchContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-game-cream to-amber-50 flex flex-col">
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
                className="flex-1 max-w-lg flex items-center justify-between gap-4 bg-white rounded-full border border-game-brown/20 shadow-md px-4 py-2 transition hover:shadow-lg"
                onClick={() => setIsPanelOpen(true)}
                aria-label="Abrir búsqueda"
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-game-brown">
                    {collapsedLabel}
                  </p>
                  <p className="text-xs text-game-brown/70">{collapsedDates}</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-game-rust text-white">
                  <SearchIcon className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search (collapsed to icon on product pages) */}
          <div className="md:hidden mt-3">
            {!hideBottomNav ? (
              <div className="w-full flex items-center bg-game-cream rounded-full px-4 py-2 border-2 border-game-brown border-opacity-20">
                <span className="text-lg mr-2">🔍</span>
                <input
                  type="text"
                  placeholder="Busca algo nuevo..."
                  className="bg-transparent outline-none w-full text-game-brown placeholder:text-game-brown placeholder:opacity-50 text-sm"
                />
              </div>
            ) : null}
          </div>

          {/* Product search modal (used when the compact 🔍 is clicked on product pages) */}
          {productSearchOpen && (
            <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setProductSearchOpen(false)} />
              <div className="relative w-full max-w-md bg-white rounded-xl p-4 mt-20 sm:mt-0">
                <div className="w-full flex items-center bg-game-cream rounded-full px-4 py-2 border-2 border-game-brown border-opacity-20">
                  <span className="text-lg mr-2">🔍</span>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Busca algo nuevo..."
                    className="bg-transparent outline-none w-full text-game-brown placeholder:text-game-brown placeholder:opacity-50"
                  />
                  <button onClick={() => setProductSearchOpen(false)} className="ml-3 px-3 py-1 rounded-md text-game-brown">Cerrar</button>
                </div>
              </div>
            </div>
          )}
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

        <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom Navigation (hidden on product detail) */}
      {!hideBottomNav && (
        <>
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
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                <span className="text-xs font-medium">Mis Juegos</span>
              </button>
              <Link
                to="/"
                className="flex flex-col items-center justify-center flex-1 py-2 sm:py-3 transition text-game-brown hover:text-game-rust"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                <span className="text-xs font-medium">Publicar</span>
              </Link>
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
              to="/publicar"
              className={`flex flex-col items-center justify-center flex-1 py-2 sm:py-3 transition ${
                isActive("/publicar")
                  ? "text-game-rust"
                  : "text-game-brown hover:text-game-rust"
              }`}
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

        <div className="h-24" />

        {isPanelOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start sm:items-center p-2 sm:p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="px-6 py-5 space-y-6 max-h-[80vh] overflow-y-auto">
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm uppercase tracking-wide text-game-brown/60 font-semibold">
                      Buscar juegos
                    </p>
                    <button
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
                      className="flex-1 outline-none text-game-brown placeholder:text-game-brown/50"
                      placeholder="Buscar juegos de mesa"
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
                        {panelRange?.from && panelRange?.to
                          ? formatRangeLabel(
                              toISODate(panelRange.from),
                              toISODate(panelRange.to),
                            )
                          : "Agregá fechas cuando quieras"}
                      </p>
                    </div>
                    <button
                      className="text-sm font-semibold text-game-rust flex items-center gap-2"
                      onClick={() => setCalendarVisible((prev) => !prev)}
                    >
                      <CalendarRange className="w-4 h-4" />
                      {calendarVisible ? "Ocultar" : "Elegir"}
                    </button>
                  </div>
                  {calendarVisible && (
                    <div className="rounded-2xl border border-game-brown/20 p-3 bg-amber-50">
                      <Calendar
                        mode="range"
                        numberOfMonths={2}
                        className="w-full sm:min-w-[520px]"
                        selected={panelRange}
                        onSelect={setPanelRange}
                        defaultMonth={panelRange?.from}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </div>
                  )}
                </section>

                <section className="flex flex-col sm:flex-row gap-3">
                  <button
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
                  className="text-sm font-semibold text-game-brown underline decoration-dotted underline-offset-4"
                  onClick={handleClearAll}
                >
                  Borrar todo
                </button>
                <div className="flex-1 w-full flex justify-end">
                  <button
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition w-full sm:w-auto"
                    onClick={handleSearchSubmit}
                  >
                    <SearchIcon className="w-5 h-5" />
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SearchContext.Provider>
  );
}
