/**
 * Helper utilities for handling image uploads from device, Google Drive URLs,
 * and web links with validation and compression.
 */

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  // Remove leading './' or '/'
  const cleanPath = trimmed.replace(/^\.?\//, '');
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${cleanPath}`;
}

/**
 * Extracts Google Drive file ID from various URL structures
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/view... or /file/d/FILE_ID
  const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) return match1[1];

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) return match2[1];

  // Pattern 3: /uc?id=FILE_ID
  const match3 = trimmed.match(/\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  if (match3 && match3[1]) return match3[1];

  // Pattern 4: /d/FILE_ID
  const match4 = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match4 && match4[1]) return match4[1];

  return null;
}

/**
 * Converts any Google Drive photo URL to high-resolution direct embed link
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already converted to googleusercontent direct CDN link
  if (trimmed.startsWith('https://lh3.googleusercontent.com/d/')) {
    return trimmed;
  }

  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
  }

  return trimmed;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com') || url.includes('lh3.googleusercontent.com/d/');
}

export function isGoogleDriveFolder(url: string): boolean {
  if (!url) return false;
  return url.includes('/drive/folders/') || url.includes('embeddedfolderview');
}

/**
 * Detects if a URL is a social media page (e.g. Instagram post/profile, Facebook)
 * which cannot be directly rendered inside an <img> tag.
 */
export function checkSocialWebpageUrl(url: string): { isSocial: boolean; platform: string } {
  if (!url) return { isSocial: false, platform: '' };
  const lower = url.toLowerCase();

  if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    return { isSocial: true, platform: 'Instagram' };
  }
  if (lower.includes('facebook.com') || lower.includes('fb.com') || lower.includes('fb.watch')) {
    return { isSocial: true, platform: 'Facebook' };
  }
  if (lower.includes('twitter.com') || lower.includes('x.com')) {
    return { isSocial: true, platform: 'Twitter/X' };
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return { isSocial: true, platform: 'YouTube' };
  }

  return { isSocial: false, platform: '' };
}

/**
 * Validates if an image URL can actually be loaded by browser.
 */
export function testImageUrl(url: string, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const resolved = resolveImageUrl(url);
    const img = new Image();
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        img.src = '';
        resolve(false);
      }
    }, timeoutMs);

    img.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(true);
      }
    };

    img.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    };

    img.src = resolved;
  });
}

/**
 * Compresses an image file selected from device to a fast-loading JPEG Data URL.
 * Resizes down to 1080px max dimension and 0.75 quality (~60KB - 110KB).
 * Extremely lightweight and fits safely in browser storage without quota issues.
 */
export function compressImageFile(file: File, maxWidth = 1080, quality = 0.75): Promise<string> {
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

        // Fill background with white for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

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
