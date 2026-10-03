const MAX_SIDE = 1600;
const SKIP_BELOW_BYTES = 900 * 1024;

/**
 * Downscales a photo in the browser so three of them fit under Vercel's 4.5 MB request
 * limit. Small files and formats the browser cannot decode are returned unchanged
 * (the server validates type and size anyway).
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= SKIP_BELOW_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
