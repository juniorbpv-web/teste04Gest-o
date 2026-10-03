/**
 * Utility to generate the Makmo Combustível Logo as a high-resolution PNG data URL
 * for embedding into PDF reports (jsPDF) and UI elements.
 */

let cachedLogoDataUrl: string | null = null;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  spacing: number
) {
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    totalWidth += ctx.measureText(text[i]).width;
    if (i < text.length - 1) totalWidth += spacing;
  }
  let currentX = centerX - totalWidth / 2;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWidth = ctx.measureText(char).width;
    ctx.fillText(char, currentX + charWidth / 2, y);
    currentX += charWidth + spacing;
  }
}

/**
 * Returns a high-DPI Base64 Data URL of the official Makmo Combustível circular logo.
 * Synchronous and self-contained with no external network latency.
 */
export function getMakmoCombustivelLogoBase64(): string {
  if (cachedLogoDataUrl) {
    return cachedLogoDataUrl;
  }

  if (typeof document === 'undefined') {
    return '';
  }

  try {
    const size = 500;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const cx = 250;
    const cy = 250;

    // 1. Deep Blue background circle
    ctx.fillStyle = '#07213d';
    ctx.beginPath();
    ctx.arc(cx, cy, 246, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Teal ring
    ctx.strokeStyle = '#20bca9';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.arc(cx, cy, 216, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Inner White arcs
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // Top Arc
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 2.7, 0.44);
    ctx.stroke();

    // Bottom Arc
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0.96, 2.18);
    ctx.stroke();

    // Side horizontal divider lines flanking COMBUSTÍVEL
    ctx.beginPath();
    ctx.moveTo(108, 358);
    ctx.lineTo(146, 358);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(354, 358);
    ctx.lineTo(392, 358);
    ctx.stroke();

    // 4. Fuel Dispenser Pump Icon
    // Base plate
    ctx.fillStyle = '#20bca9';
    drawRoundedRect(ctx, 215, 198, 70, 9, 4.5);
    ctx.fill();

    // Main housing
    drawRoundedRect(ctx, 224, 110, 52, 90, 8);
    ctx.fill();

    // Meter window cutout (dark blue)
    ctx.fillStyle = '#07213d';
    drawRoundedRect(ctx, 233, 122, 34, 26, 4);
    ctx.fill();

    // Hose & Nozzle
    ctx.strokeStyle = '#20bca9';
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(279, 142);
    ctx.bezierCurveTo(298, 144, 306, 164, 304, 182);
    ctx.bezierCurveTo(302, 198, 291, 198, 287, 187);
    ctx.lineTo(286, 162);
    ctx.stroke();

    // Nozzle
    ctx.fillStyle = '#20bca9';
    ctx.beginPath();
    ctx.moveTo(283, 159);
    ctx.lineTo(292, 144);
    ctx.lineTo(286, 130);
    ctx.lineTo(285, 124);
    ctx.lineTo(291, 120);
    ctx.lineTo(296, 130);
    ctx.lineTo(297, 148);
    ctx.closePath();
    ctx.fill();

    // 5. Typography MAKMO
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px "Arial Black", "Montserrat", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MAKMO', cx, 292);

    // 6. Typography COMBUSTÍVEL
    ctx.fillStyle = '#20bca9';
    ctx.font = '700 20px "Arial", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawSpacedText(ctx, 'COMBUSTÍVEL', cx, 358, 6.5);

    cachedLogoDataUrl = canvas.toDataURL('image/png');
    return cachedLogoDataUrl;
  } catch (err) {
    console.error('Error creating Makmo Combustivel Logo base64:', err);
    return '';
  }
}

let cachedInfraBannerUrl: string | null = null;

/**
 * Returns a high-DPI Base64 Data URL of the official Makmo Infraestrutura corporate banner logo.
 * Replicates the exact typography, glyphs, and deep blue banner styling for PDF reports.
 */
export function getMakmoInfraestruturaBannerBase64(): string {
  if (cachedInfraBannerUrl) {
    return cachedInfraBannerUrl;
  }

  if (typeof document === 'undefined') {
    return '';
  }

  try {
    const width = 960;
    const height = 320;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 1. Background in Corporate Deep Blue (matching the official banner)
    ctx.fillStyle = '#15395b';
    ctx.fillRect(0, 0, width, height);

    // Scale 2x for high resolution from 480x160 base coordinate system
    ctx.save();
    ctx.scale(2, 2);

    if (typeof Path2D !== 'undefined') {
      // Letter 1: 'm' (Pure White)
      const pM1 = new Path2D(
        'M 34 15 L 82 15 A 14 14 0 0 1 96 29 L 96 85 L 82 85 L 82 33 A 4 4 0 0 0 78 29 L 65 29 A 4 4 0 0 0 61 33 L 61 85 L 47 85 L 47 33 A 4 4 0 0 0 43 29 L 30 29 A 4 4 0 0 0 26 33 L 26 85 L 12 85 L 12 29 A 14 14 0 0 1 26 15 Z'
      );
      ctx.fillStyle = '#ffffff';
      ctx.fill(pM1, 'evenodd');

      // Letter 2: 'a' (Teal/Cyan #20bca9)
      const pA = new Path2D(
        'M 124 15 L 148 15 A 14 14 0 0 1 162 29 L 162 85 L 148 85 L 148 78 A 14 14 0 0 1 134 85 L 124 85 A 14 14 0 0 1 110 71 L 110 29 A 14 14 0 0 1 124 15 Z M 125 30 A 4 4 0 0 0 124 34 L 124 66 A 4 4 0 0 0 128 70 L 134 70 A 4 4 0 0 0 138 66 L 138 34 A 4 4 0 0 0 134 30 Z'
      );
      ctx.fillStyle = '#20bca9';
      ctx.fill(pA, 'evenodd');

      // Letter 3: 'k' Chevron (Teal/Cyan #20bca9)
      const pK = new Path2D(
        'M 198 15 L 178 48 A 4 4 0 0 0 178 52 L 198 85 L 214 85 L 193 51 A 1.5 1.5 0 0 1 193 49 L 214 15 Z'
      );
      ctx.fillStyle = '#20bca9';
      ctx.fill(pK);

      // Letter 4: 'm' (Pure White)
      const pM2 = new Path2D(
        'M 248 15 L 296 15 A 14 14 0 0 1 310 29 L 310 85 L 296 85 L 296 33 A 4 4 0 0 0 292 29 L 279 29 A 4 4 0 0 0 275 33 L 275 85 L 261 85 L 261 33 A 4 4 0 0 0 257 29 L 244 29 A 4 4 0 0 0 240 33 L 240 85 L 226 85 L 226 29 A 14 14 0 0 1 240 15 Z'
      );
      ctx.fillStyle = '#ffffff';
      ctx.fill(pM2, 'evenodd');

      // Letter 5: 'o' (Pure White)
      const pO = new Path2D(
        'M 338 15 L 366 15 A 14 14 0 0 1 380 29 L 380 71 A 14 14 0 0 1 366 85 L 338 85 A 14 14 0 0 1 324 71 L 324 29 A 14 14 0 0 1 338 15 Z M 340 30 A 4 4 0 0 0 338 34 L 338 66 A 4 4 0 0 0 342 70 L 362 70 A 4 4 0 0 0 366 66 L 366 34 A 4 4 0 0 0 362 30 Z'
      );
      ctx.fillStyle = '#ffffff';
      ctx.fill(pO, 'evenodd');

      // Subtitle: INFRAESTRUTURA
      ctx.fillStyle = '#ffffff';
      ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      drawSpacedText(ctx, 'INFRAESTRUTURA', 197, 116, 10);

      // Macchina wave icon at bottom-right
      const pMacchina = new Path2D(
        'M 4 13 L 10 2 C 10.5 1 11.8 1 12.3 2 L 16 9 L 19.7 2 C 20.2 1 21.5 1 22 2 L 28 13 C 28.5 14 27.8 15 26.7 15 L 24 15 C 23.3 15 22.8 14.5 22.4 13.8 L 20.9 9.8 L 17.6 15.2 C 17.2 15.8 16.2 16 15.6 15.6 L 14.4 13.8 L 11.2 9.8 L 9.6 13.8 C 9.2 14.5 8.7 15 8 15 L 5.3 15 C 4.2 15 3.5 14 4 13 Z'
      );
      ctx.save();
      ctx.translate(322, 133);
      ctx.fillStyle = '#ffffff';
      ctx.fill(pMacchina);

      // Macchina text
      ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('macchina', 32, 13);
      ctx.restore();
    }

    ctx.restore();

    cachedInfraBannerUrl = canvas.toDataURL('image/png');
    return cachedInfraBannerUrl;
  } catch (err) {
    console.error('Error creating Makmo Infraestrutura Banner base64:', err);
    return '';
  }
}
