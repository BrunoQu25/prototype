import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";

type ImgItem = { url: string; fileName: string; type: "hero"|"gallery"; width?: number; height?: number };

interface Props {
  value: ImgItem[];
  onChange: (v: ImgItem[]) => void;
  max?: number;
}

const ACCEPT = ["image/jpeg","image/png","image/webp"];

async function compressToDataUrl(file: File, maxWidth = 1280, quality = 0.7): Promise<{dataUrl:string, width:number, height:number}> {
  const blobUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = blobUrl;
    await new Promise((res, rej) => { img.onload = () => res(null); img.onerror = rej; });
    const scale = Math.min(1, maxWidth / (img.width || maxWidth));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    return { dataUrl, width: w, height: h };
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

export default function ImageUploader({ value, onChange, max = 6 }: Props) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onFiles(files: FileList | null) {
    if (!files) return;
    const pending: Promise<ImgItem | null>[] = [];
    for (const f of Array.from(files)) {
      if (!ACCEPT.includes(f.type)) {
        setError("Formato no soportado. Usa JPG, PNG o WEBP.");
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        setError("Imagen demasiado grande (máx 5MB antes de comprimir).");
        continue;
      }
      pending.push((async () => {
        const { dataUrl, width, height } = await compressToDataUrl(f);
        // check size after compression
        const bytes = Math.ceil((dataUrl.length * 3) / 4) - (dataUrl.endsWith("==") ? 2 : dataUrl.endsWith("=") ? 1 : 0);
        if (bytes > 1.5 * 1024 * 1024) {
          setError("Imagen comprimida supera 1.5MB. Elige otra.");
          return null;
        }
        return { url: dataUrl, fileName: f.name, type: value.length === 0 ? "hero" : "gallery", width, height };
      })());
    }
    Promise.all(pending).then(items => {
      const valid = items.filter((x): x is ImgItem => !!x);
      if (!valid.length) return;
      const next = [...value, ...valid].slice(0, max);
      onChange(next);
      setError(null);
    });
  }

  function removeAt(i: number) {
    const next = value.slice();
    next.splice(i, 1);
    // Ensure at least first image is hero
    if (next.length && !next.some(x => x.type === "hero")) next[0].type = "hero";
    onChange(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    // keep first as hero
    next.forEach((x, idx) => x.type = idx === 0 ? "hero" : "gallery");
    onChange(next);
  }

  return (
    <div className="w-full">
      <div
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer bg-white/60 hover:bg-white"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <Upload className="w-8 h-8 mx-auto mb-2" />
        <p className="font-medium">Arrastrá y soltá imágenes o hacé clic para seleccionar</p>
        <p className="text-sm text-brown-600">Máx 5MB por imagen. Se comprimen a 1280px de ancho.</p>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {value.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((img, i) => (
            <li key={i} className="relative border rounded-lg overflow-hidden bg-white">
              <img src={img.url} alt={img.fileName} className="w-full h-32 object-cover" />
              <div className="absolute top-1 left-1">{i === 0 ? <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-game-gold/90">HERO</span> : null}</div>
              <div className="absolute bottom-1 right-1 flex gap-1">
                <Button size="icon" variant="secondary" type="button" onClick={() => move(i, -1)}><ArrowUp className="w-4 h-4" /></Button>
                <Button size="icon" variant="secondary" type="button" onClick={() => move(i, 1)}><ArrowDown className="w-4 h-4" /></Button>
                <Button size="icon" variant="destructive" type="button" onClick={() => removeAt(i)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
