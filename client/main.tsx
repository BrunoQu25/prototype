import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PublishGame from "./pages/PublishGame";
import ProductDetail from "./pages/ProductDetail";
import GameRules from "./pages/GameRules";
import GameReviews from "./pages/GameReviews";
import RentalDetails from "./pages/RentalDetails";
import RentalDelivery from "./pages/RentalDelivery";
import RentalConfirm from "./pages/RentalConfirm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RootApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publicar" element={<PublishGame />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/rules" element={<GameRules />} />
          <Route path="/product/:id/reviews" element={<GameReviews />} />
          <Route path="/product/:id/rental" element={<RentalDetails />} />
          <Route path="/product/:id/rental/delivery" element={<RentalDelivery />} />
          <Route path="/product/:id/rental/confirm" element={<RentalConfirm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<RootApp />);

export default RootApp;
