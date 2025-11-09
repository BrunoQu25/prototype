import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { games } from "@/data/games";
import Layout from "@/components/Layout";

export default function RentalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!startDate || !endDate) {
      setError("Seleccione fecha de inicio y fecha de fin");
      return;
    }
    const s = new Date(startDate);
    const eD = new Date(endDate);
    if (eD <= s) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    // Navigate to delivery/payment step with dates in state
    navigate(`/product/${id}/rental/delivery`, {
      state: { startDate, endDate },
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-game-brown mb-4">
          Detalles del alquiler
        </h1>
        <form
          onSubmit={submit}
          className="space-y-4 bg-white p-6 rounded-2xl shadow-md border-2 border-game-brown border-opacity-10"
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-game-brown/20 p-4 bg-amber-50 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-game-brown">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                    className="w-full rounded-2xl border border-game-brown/20 bg-white px-4 py-3 text-game-brown shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-game-brown">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full rounded-2xl border border-game-brown/20 bg-white px-4 py-3 text-game-brown shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <p className="text-xs text-game-brown/70">
                  Seleccioná un rango completo para continuar.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setError("");
                  }}
                  className="text-xs font-semibold text-game-rust underline decoration-dotted underline-offset-4 hover:text-game-brown"
                >
                  Reiniciar fechas
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-game-brown text-game-brown"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-game-rust text-white font-semibold"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
      {/* Sección de video: cómo jugar */}
    </Layout>
  );
}
