const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Kecilkan foto sebelum diunggah: batasi sisi terpanjang ke 1920px dan
 * simpan sebagai WebP/JPEG agar ukuran berkas jauh lebih ringan.
 * Foto kecil (di bawah batas) dikembalikan apa adanya.
 */
export async function resizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  // Sudah cukup kecil dan tidak berat — tidak perlu diubah.
  if (scale >= 1 && file.size <= 2 * 1024 * 1024) {
    bitmap.close();
    return file;
  }

  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  const outputType = file.type === "image/png" ? "image/png" : "image/webp";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, JPEG_QUALITY),
  );
  if (!blob) return file;

  // Jika hasilnya justru lebih besar, pakai berkas asli.
  if (blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "foto";
  const extension = outputType === "image/png" ? "png" : "webp";
  return new File([blob], `${baseName}.${extension}`, { type: outputType });
}

export function validateImageFile(file: File): void {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new Error("Pilih foto JPG, PNG, atau WebP.");
  if (file.size > MAX_BYTES) throw new Error("Ukuran foto maksimal 10 MB.");
}
