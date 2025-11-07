import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";

export default function RentalDelivery() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as { startDate?: string; endDate?: string };

  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [payment, setPayment] = useState<string>("mercado");
  const [address, setAddress] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "delivery" && !address.trim()) {
      toast({
        title: "Dirección requerida",
        description: "Por favor ingresa una dirección para la entrega.",
      });
      return;
    }

    navigate(`/product/${id}/rental/confirm`, {
      state: { ...state, method, payment, address },
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-game-brown mb-4">Retiro y Pago</h1>
        <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-2xl shadow-md border-2 border-game-brown border-opacity-10">
          <div>
            <p className="font-semibold text-game-brown mb-2">Fechas</p>
            <div className="text-sm text-game-brown">Inicio: <strong>{state.startDate ?? "-"}</strong></div>
            <div className="text-sm text-game-brown">Fin: <strong>{state.endDate ?? "-"}</strong></div>
          </div>

          <div>
            <p className="font-semibold text-game-brown mb-2">Modo de retiro</p>
            <div className="flex gap-3">
              <label className={`px-4 py-2 rounded-md border ${method === "pickup" ? "border-game-rust bg-game-rust text-white" : "border-game-brown"}`}>
                <input type="radio" name="method" value="pickup" checked={method === "pickup"} onChange={() => setMethod("pickup")} className="hidden" />
                Pickup
              </label>
              <label className={`px-4 py-2 rounded-md border ${method === "delivery" ? "border-game-rust bg-game-rust text-white" : "border-game-brown"}`}>
                <input type="radio" name="method" value="delivery" checked={method === "delivery"} onChange={() => setMethod("delivery")} className="hidden" />
                Delivery
              </label>
            </div>
            <div className="text-sm text-game-brown mt-2">
              {method === "pickup" ? "Retiro en casa del propietario" : "Entrega a domicilio"}
              {method === "pickup" && <p> Bulevar Artigas 1234</p>}
            </div>
          </div>

          {method === "delivery" && (
            <div>
              <label className="block text-sm font-semibold text-game-brown mb-1">Dirección de entrega</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-md border border-game-brown border-opacity-10 px-3 py-2" placeholder="Calle, número, piso" />
            </div>
          )}

          <div>
            <p className="font-semibold text-game-brown mb-2">Método de pago</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="mercado" checked={payment === "mercado"} onChange={() => setPayment("mercado")} />
                <span className="ml-2">Mercado Pago</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="cash" checked={payment === "cash"} onChange={() => setPayment("cash")} />
                <span className="ml-2">Efectivo</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-game-brown text-game-brown">Volver</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-game-rust text-white font-semibold">Confirmar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
