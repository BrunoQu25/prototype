import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { games } from "@/data/games";

export default function RentalConfirm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as any;
  const game = games.find((g) => g.id === parseInt(id || "0"));

  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  const confirm = () => {
    // Simulate success UI then redirect to main
    setShowSuccess(true);
    // clear any previous
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setShowSuccess(false);
      navigate(`/`);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-game-brown mb-4">Resumen del pedido</h1>
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-game-brown border-opacity-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-game-gold to-amber-200 flex items-center justify-center text-3xl">{game?.image}</div>
            <div>
              <p className="font-bold text-game-brown">{game?.title}</p>
              <p className="text-sm text-game-brown text-opacity-60">{game?.category}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-game-brown">Inicio: <strong>{state.startDate ?? "-"}</strong></p>
            <p className="text-sm text-game-brown">Fin: <strong>{state.endDate ?? "-"}</strong></p>
            <p className="text-sm text-game-brown">Retiro: <strong>{state.method ?? "pickup"}</strong></p>
            {state.method === "delivery" && (
              <p className="text-sm text-game-brown">Dirección: <strong>{state.address}</strong></p>
            )}
            <p className="text-sm text-game-brown">Pago: <strong>{state.payment === "mercado" ? "Mercado Pago" : "Efectivo"}</strong></p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-game-brown">Total estimado</p>
              <p className="text-2xl font-bold text-game-rust">${game?.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-game-brown">Volver</button>
              <button onClick={confirm} className="px-4 py-2 rounded-lg bg-game-rust text-white font-semibold">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-game-sage bg-opacity-95"
        >
          <div className="text-center text-white p-6 rounded-lg">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Reserva confirmada</h2>
            <p className="opacity-90">Gracias — serás redirigido al inicio</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
