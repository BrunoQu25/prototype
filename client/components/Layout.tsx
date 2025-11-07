import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Home, Plus, User, Dice6 } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-cream to-amber-50 flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-white shadow-md border-b-4 border-game-rust"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center">
              <img
                src="https://images.vexels.com/media/users/3/189702/isolated/preview/0909c4a72562b45eb247012f1606c4c6-icono-de-juguete-de-dados.png"
                alt="App Logo"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
            {/* Search Bar */}
            <div className="flex flex-1 max-w-md">
              <div className="w-full flex items-center bg-game-cream rounded-full px-4 py-2 border-2 border-game-brown border-opacity-20">
                <span className="text-lg mr-2">🔍</span>
                <input
                  type="text"
                  placeholder="Busca algo nuevo..."
                  className="bg-transparent outline-none w-full text-game-brown placeholder:text-game-brown placeholder:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom Navigation */}
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

      {/* Padding for bottom nav */}
      <div className="h-24"></div>
    </div>
  );
}
