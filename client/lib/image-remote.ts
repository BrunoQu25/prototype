// Baja, comprime y devuelve dataURL <= ~1.5MB
export async function fetchAndCompressToDataURL(
  url: string,
  maxWidth = 1280,
  qualityStart = 0.7,
): Promise<{ dataURL: string; width: number; height: number }> {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error("No se pudo descargar la imagen");
  const blob = await res.blob();

  const bmp = await createImageBitmap(blob);
  const ratio = Math.min(1, maxWidth / bmp.width);
  const w = Math.max(1, Math.round(bmp.width * ratio));
  const h = Math.max(1, Math.round(bmp.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0, w, h);

  let q = qualityStart;
  let dataURL = canvas.toDataURL("image/jpeg", q);

  const bytes = (s: string) =>
    Math.ceil((s.length - "data:image/jpeg;base64,".length) * 0.75);

  while (bytes(dataURL) > 1.5 * 1024 * 1024 && q > 0.35) {
    q -= 0.1;
    dataURL = canvas.toDataURL("image/jpeg", q);
  }
  return { dataURL, width: w, height: h };
}
