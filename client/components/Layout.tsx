import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, Menu, Home, Gamepad2, Plus, MoreHorizontal, User } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-cream to-amber-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md border-b-4 border-game-rust" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🎲</span>
              <span className="font-bold text-xl text-game-brown hidden sm:inline">TableTop Quest</span>
              <span className="font-bold text-xl text-game-brown sm:hidden">TTQ</span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="w-full flex items-center bg-game-cream rounded-full px-4 py-2 border-2 border-game-brown border-opacity-20">
                <span className="text-lg mr-2">🔍</span>
                <input
                  type="text"
                  placeholder="Busca algo nuevo..."
                  className="bg-transparent outline-none w-full text-game-brown placeholder:text-game-brown placeholder:opacity-50"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="p-2 hover:bg-game-cream rounded-lg transition text-game-brown">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-game-cream rounded-lg transition text-game-brown">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button
                className="md:hidden p-2 hover:bg-game-cream rounded-lg transition text-game-brown"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="w-full flex items-center bg-game-cream rounded-full px-4 py-2 border-2 border-game-brown border-opacity-20">
              <span className="text-lg mr-2">🔍</span>
              <input
                type="text"
                placeholder="Busca algo nuevo..."
                className="bg-transparent outline-none w-full text-game-brown placeholder:text-game-brown placeholder:opacity-50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-game-brown border-opacity-20 bg-white">
            <nav className="flex flex-col gap-1 px-4 py-3">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive("/") ? "bg-game-rust text-white" : "hover:bg-game-cream text-game-brown"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/product/1"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive("/product/1") ? "bg-game-rust text-white" : "hover:bg-game-cream text-game-brown"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-4 border-game-rust shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center w-full py-3 sm:py-4 transition ${
              isActive("/") ? "text-game-rust" : "text-game-brown hover:text-game-rust"
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm font-medium">Inicio</span>
          </Link>
          <button className="flex flex-col items-center justify-center w-full py-3 sm:py-4 transition text-game-brown hover:text-game-rust">
            <Gamepad2 className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm font-medium">Mis Juegos</span>
          </button>
          <Link
            to="/"
            className="flex flex-col items-center justify-center w-full py-3 sm:py-4 transition text-game-brown hover:text-game-rust"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm font-medium">Agregar</span>
          </Link>
          <button className="flex flex-col items-center justify-center w-full py-3 sm:py-4 transition text-game-brown hover:text-game-rust">
            <MoreHorizontal className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm font-medium">Más</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full py-3 sm:py-4 transition text-game-brown hover:text-game-rust">
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs sm:text-sm font-medium">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Padding for bottom nav */}
      <div className="h-24"></div>
    </div>
  );
}
