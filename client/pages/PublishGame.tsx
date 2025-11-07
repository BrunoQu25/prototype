import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Wizard from "@/components/Wizard";
import ImageUploader from "@/components/ImageUploader";
import { z } from "zod";
import { categories } from "@/data/games";
import { fetchAndCompressToDataURL } from "@/lib/image-remote";
import type { PublishedGame } from "@/types/listing";
import {
  addListing,
  loadListings,
  clearListings,
  exportListings,
  importListings,
} from "@/state/listings";
import { suggestGames } from "@/data/suggested-games";
import type { GameSuggest } from "@/data/suggested-games";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload } from "lucide-react";

function uuidv4(): string {
  // RFC4122 version 4 using crypto
  const rnds = crypto.getRandomValues(new Uint8Array(16));
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;
  const hex = [...rnds].map((b) => b.toString(16).padStart(2, "0"));
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
}

const formatUYU = (n: number) =>
  new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(n);

const steps = ["Datos", "Fotos", "Precio y visibilidad", "Revisión"];

const basicSchema = z.object({
  title: z.string().min(1, "Requerido"),
  publisher: z.string().optional(),
  category: z.string().min(1, "Requerido"),
  players: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.string().optional(),
  description: z.string().min(1, "Requerido"),
});

const priceSchema = z.object({
  condition: z.enum(["new", "like_new", "good", "fair", "worn"]),
  pricePerDay: z.coerce.number().positive("Debe ser > 0"),
  deposit: z.coerce.number().min(0, "No puede ser negativo").default(0),
  visibility: z.enum(["public", "private"]),
});

export default function PublishGame() {
  const { toast } = useToast();
  const nav = useNavigate();

  const [step, setStep] = useState(0);
  const [basic, setBasic] = useState<any>({
    title: "",
    publisher: "",
    category: "",
    players: "",
    duration: "",
    difficulty: "",
    description: "",
  });
  const [imgs, setImgs] = useState<
    {
      url: string;
      fileName: string;
      type: "hero" | "gallery";
      width?: number;
      height?: number;
    }[]
  >([]);
  const [price, setPrice] = useState<any>({
    condition: "like_new",
    pricePerDay: "",
    deposit: 0,
    visibility: "public",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateStep(idx: number): boolean {
    if (idx === 0) {
      const res = basicSchema.safeParse(basic);
      if (!res.success) {
        const issueMap: Record<string, string> = {};
        res.error.issues.forEach(
          (i) => (issueMap[i.path.join(".")] = i.message),
        );
        setErrors(issueMap);
        return false;
      }
      setErrors({});
      return true;
    }
    if (idx === 1) {
      if (imgs.length === 0) {
        setErrors({ images: "Se requiere al menos una imagen hero" });
        return false;
      }
      setErrors({});
      return true;
    }
    if (idx === 2) {
      const res = priceSchema.safeParse(price);
      if (!res.success) {
        const issueMap: Record<string, string> = {};
        res.error.issues.forEach(
          (i) => (issueMap[i.path.join(".")] = i.message),
        );
        setErrors(issueMap);
        return false;
      }
      setErrors({});
      return true;
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep(Math.min(step + 1, steps.length - 1));
  }
  function prev() {
    setStep(Math.max(step - 1, 0));
  }

  function onPublish() {
    if (!validateStep(2)) return;
    if (!imgs.length) return;
    const id = uuidv4();
    const item: PublishedGame = {
      id,
      title: basic.title,
      publisher: basic.publisher || undefined,
      category: basic.category,
      images: imgs,
      description: basic.description,
      duration: basic.duration || undefined,
      players: basic.players || undefined,
      difficulty: basic.difficulty || undefined,
      pricePerDay: Number(price.pricePerDay),
      deposit: Number(price.deposit) || 0,
      condition: price.condition,
      visibility: price.visibility,
      createdAt: new Date().toISOString(),
    };
    try {
      addListing(item);
    } catch (e: any) {
      toast({
        title: "Error al publicar",
        description: e.message || String(e),
      });
      return;
    }
    toast({
      title: "Publicado",
      description: "Tu juego fue publicado con éxito",
    });
    // go to detail
    nav(`/product/dyn_${id}`);
  }
  function goTo(target: number) {
    if (target <= step) {
      setStep(target);
      return;
    }
    // No permite saltar hacia adelante si falta algo
    for (let s = 0; s < target; s++) {
      if (!validateStep(s)) {
        setStep(s);
        return;
      }
    }
    setStep(target);
  }

  function exportMine() {
    const data = exportListings();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mis-publicaciones.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((t) => {
      try {
        const arr = JSON.parse(t);
        const n = importListings(arr);
        toast({
          title: "Importadas",
          description: `Total en dispositivo: ${n}`,
        });
      } catch {
        toast({ title: "Error", description: "Archivo inválido" });
      }
    });
  }

  function wipe() {
    clearListings();
    toast({
      title: "Listo",
      description: "Se borraron tus publicaciones locales",
    });
  }
  const [titleFocus, setTitleFocus] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const suggestions = useMemo(
    () => suggestGames(basic.title, 6),
    [basic.title],
  );

  async function pickSuggestion(s: GameSuggest) {
    // Completar campos
    setBasic((b: any) => ({
      ...b,
      title: s.title,
      publisher: s.publisher || "Devir",
      category: s.category,
      players: s.players ?? b.players,
      duration: s.duration ?? b.duration,
      difficulty: s.difficulty ?? b.difficulty,
      description:
        s.description ??
        "Juego en excelente estado. Componentes completos y reglas incluidas.",
    }));
    setPrice((p: any) => ({
      ...p,
      pricePerDay: s.pricePerDay ?? p.pricePerDay,
      deposit: s.deposit ?? p.deposit,
    }));
    try {
      const { dataURL, width, height } = await fetchAndCompressToDataURL(
        s.hero,
      );
      setImgs([
        { url: dataURL, type: "hero", width, height, fileName: `${s.key}.jpg` },
      ]);
    } catch {
      // si falla la imagen, seguimos igual
    }
    setTitleFocus(false);
  }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="pt-4 pb-6">
          <h1 className="text-2xl font-extrabold text-game-brown">
            Publicar un juego
          </h1>
          <p className="text-brown-700">
            Creá una publicación para que otros puedan alquilar tu juego.
          </p>
        </div>

        <Wizard
          steps={steps}
          current={step}
          onPrev={step > 0 ? prev : undefined}
          onNext={step < steps.length - 1 ? next : undefined}
          onGoTo={goTo}
        />

        {/* Step content */}
        {step === 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Datos del juego</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Plantillas rápidas */}

              <div>
                <div className="relative">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={basic.title}
                    onFocus={() => setTitleFocus(true)}
                    onBlur={() => setTimeout(() => setTitleFocus(false), 120)}
                    onChange={(e) => {
                      setBasic({ ...basic, title: e.target.value });
                      setActiveIdx(0);
                    }}
                    onKeyDown={(e) => {
                      if (!suggestions.length) return;
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveIdx((i) =>
                          Math.min(i + 1, suggestions.length - 1),
                        );
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActiveIdx((i) => Math.max(i - 1, 0));
                      }
                      if (e.key === "Enter") {
                        e.preventDefault();
                        pickSuggestion(suggestions[activeIdx]);
                      }
                    }}
                    placeholder="Ej: Catan, Catan: Navegantes…"
                  />
                  {/* Dropdown de sugerencias */}
                  {titleFocus && suggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border border-game-brown/10 bg-white shadow-lg overflow-hidden">
                      {suggestions.map((s, i) => (
                        <button
                          type="button"
                          key={s.key}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pickSuggestion(s)}
                          className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-amber-50 ${
                            i === activeIdx ? "bg-amber-50" : ""
                          }`}
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-game-gold/10 flex-none">
                            <img
                              src={s.hero}
                              alt={s.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-game-brown line-clamp-1">
                              {s.title}
                            </div>
                            <div className="text-xs text-game-brown/70 line-clamp-1">
                              {s.publisher} · {s.category} · {s.players ?? "-"}
                            </div>
                          </div>
                          {s.pricePerDay && (
                            <div className="ml-auto text-xs font-semibold text-game-rust">
                              {s.pricePerDay} UYU/día
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="publisher">Editorial</Label>
                <Input
                  id="publisher"
                  value={basic.publisher}
                  onChange={(e) =>
                    setBasic({ ...basic, publisher: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={basic.category}
                  onValueChange={(v) => setBasic({ ...basic, category: v })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccioná una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>
              <div>
                <Label htmlFor="players">Jugadores</Label>
                <Input
                  id="players"
                  value={basic.players}
                  onChange={(e) =>
                    setBasic({ ...basic, players: e.target.value })
                  }
                  placeholder="Ej: 2-4 jugadores"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duración</Label>
                <Input
                  id="duration"
                  value={basic.duration}
                  onChange={(e) =>
                    setBasic({ ...basic, duration: e.target.value })
                  }
                  placeholder="Ej: 60-90 min"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Input
                  id="difficulty"
                  value={basic.difficulty}
                  onChange={(e) =>
                    setBasic({ ...basic, difficulty: e.target.value })
                  }
                  placeholder="Ej: Fácil / Media / Difícil"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={basic.description}
                  onChange={(e) =>
                    setBasic({ ...basic, description: e.target.value })
                  }
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader value={imgs} onChange={setImgs} />
              {errors.images && (
                <p className="text-sm text-red-600 mt-2">{errors.images}</p>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Condiciones y precio</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condition">Estado *</Label>
                <Select
                  value={price.condition}
                  onValueChange={(v) => setPrice({ ...price, condition: v })}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Seleccioná el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuevo</SelectItem>
                    <SelectItem value="like_new">Como nuevo</SelectItem>
                    <SelectItem value="good">Bueno</SelectItem>
                    <SelectItem value="fair">Aceptable</SelectItem>
                    <SelectItem value="worn">Gastado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pricePerDay">Precio por día (UYU) *</Label>
                <Input
                  id="pricePerDay"
                  inputMode="numeric"
                  value={price.pricePerDay}
                  onChange={(e) =>
                    setPrice({ ...price, pricePerDay: e.target.value })
                  }
                />
                {errors.pricePerDay && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.pricePerDay}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Revisión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-brown-600">Título</span>
                  <div className="font-semibold">{basic.title}</div>
                </div>
                <div>
                  <span className="text-sm text-brown-600">Categoría</span>
                  <div className="font-semibold">{basic.category}</div>
                </div>
                <div>
                  <span className="text-sm text-brown-600">Jugadores</span>
                  <div className="font-semibold">{basic.players || "-"}</div>
                </div>
                <div>
                  <span className="text-sm text-brown-600">Duración</span>
                  <div className="font-semibold">{basic.duration || "-"}</div>
                </div>
                <div>
                  <span className="text-sm text-brown-600">Dificultad</span>
                  <div className="font-semibold">{basic.difficulty || "-"}</div>
                </div>
                <div>
                  <span className="text-sm text-brown-600">Precio</span>
                  <div className="font-semibold">
                    {price.pricePerDay
                      ? formatUYU(Number(price.pricePerDay))
                      : "-"}
                    /día
                  </div>
                </div>
              </div>
              {imgs.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imgs.map((im, i) => (
                    <img
                      key={i}
                      src={im.url}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button onClick={onPublish} className="font-bold">
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
