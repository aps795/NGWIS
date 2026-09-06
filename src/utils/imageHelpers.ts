/**
 * Helper utilities for handling image uploads from device and Google Drive URLs
 */

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) {
    return `https://lh3.googleusercontent.com/d/${match1[1]}=w1600`;
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID or ?id=FILE_ID
  const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) {
    return `https://lh3.googleusercontent.com/d/${match2[1]}=w1600`;
  }

  // Pattern 3: https://drive.google.com/uc?...id=FILE_ID
  const match3 = trimmed.match(/\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  if (match3 && match3[1]) {
    return `https://lh3.googleusercontent.com/d/${match3[1]}=w1600`;
  }

  return trimmed;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

/**
 * Compresses an image file selected from device to a fast-loading JPEG Data URL
 * Prevents localStorage quota exhaustion while preserving high visual quality.
 */
export function compressImageFile(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to decode image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from device.'));
    reader.readAsDataURL(file);
  });
}
