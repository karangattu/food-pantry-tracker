/**
 * Client-side image compression.
 * Resizes images to a max dimension and compresses to JPEG/WebP
 * to keep storage in Turso minimal (~30-50KB per image).
 */

const MAX_DIMENSION = 400; // px — enough for product thumbnails
const QUALITY = 0.6; // 60% quality — good balance of size vs clarity

/**
 * Compress an image File to a base64 data URI string.
 * Targets ~30-50KB output per image.
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate scaled dimensions
      let { width, height } = img;
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
      }

      // Draw to canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first (smaller), fall back to JPEG
      let dataUri = canvas.toDataURL("image/webp", QUALITY);
      if (!dataUri.startsWith("data:image/webp")) {
        // Browser doesn't support WebP encoding — use JPEG
        dataUri = canvas.toDataURL("image/jpeg", QUALITY);
      }

      resolve(dataUri);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Get the approximate size in bytes of a base64 data URI.
 */
export function getBase64Size(dataUri: string): number {
  // Remove the data:...;base64, prefix
  const base64 = dataUri.split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}

/**
 * Format bytes to a human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
