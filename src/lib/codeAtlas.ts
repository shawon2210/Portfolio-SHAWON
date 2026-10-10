/**
 * High-Resolution Syntax Code Texture Atlas Generator for WebGL
 * Packs short developer snippets into a single 2048x1024 canvas texture.
 * Exactly 1 draw call for all instanced floating cards.
 */

import * as THREE from 'three';
import { FLOATING_SNIPPETS, CodeSnippet } from '../data/floatingCode';
import { SYNTAX_PALETTE } from './tokens';

export interface AtlasTile {
  uOffset: number;
  vOffset: number;
  uScale: number;
  vScale: number;
}

export interface CodeAtlasResult {
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
  tiles: AtlasTile[];
}

export async function createCodeAtlas(): Promise<CodeAtlasResult> {
  // 1. Wait for fonts if document is ready
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback if font loading fails
    }
  }

  const canvasWidth = 2048;
  const canvasHeight = 1024;
  const cols = 4;
  const rows = 2;
  const tileWidth = canvasWidth / cols; // 512
  const tileHeight = canvasHeight / rows; // 512

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });

  if (!ctx) {
    throw new Error('Failed to create offscreen 2D canvas context for Code Atlas');
  }

  // Clear canvas transparent
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const tiles: AtlasTile[] = [];

  FLOATING_SNIPPETS.forEach((snippet, index) => {
    if (index >= cols * rows) return;

    const col = index % cols;
    const row = Math.floor(index / cols);

    const x = col * tileWidth;
    const y = row * tileHeight;

    // Render single snippet tile
    renderSnippetTile(ctx, snippet, x, y, tileWidth, tileHeight);

    // Three.js UV space: (0,0) is bottom-left, (1,1) is top-right
    // row 0 is top of canvas -> in WebGL UV it is at 1 - (row + 1) / rows
    const uOffset = col / cols;
    const vOffset = (rows - 1 - row) / rows;
    const uScale = 1 / cols;
    const vScale = 1 / rows;

    tiles.push({ uOffset, vOffset, uScale, vScale });
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return { canvas, texture, tiles };
}

function renderSnippetTile(
  ctx: CanvasRenderingContext2D,
  snippet: CodeSnippet,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const pad = 16;
  const cardX = x + pad;
  const cardY = y + pad;
  const cardW = w - pad * 2;
  const cardH = h - pad * 2;
  const radius = 16;

  ctx.save();

  // 1. Draw rounded card background with subtle glass fill
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.fillStyle = 'rgba(12, 16, 26, 0.95)';
  ctx.fill();

  // Faint glass border with subtle cyan tint
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.stroke();

  // Top highlight border line
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, 2.5, [radius, radius, 0, 0]);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.fill();

  // 2. Window Header Bar
  const headerHeight = 36;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(cardX + 1, cardY + 1, cardW - 2, headerHeight);

  // 3 Window Control Dots (muted glass dots)
  const dotY = cardY + 18;
  const dotRadius = 4;
  const dotSpacing = 12;
  const dotStartX = cardX + 20;

  // Red/amber/green muted
  const dotColors = ['#f87171', '#fbbf24', '#34d399'];
  dotColors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(dotStartX + i * dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  });

  // Filename Tag
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(snippet.filename, dotStartX + 3 * dotSpacing + 8, dotY + 4);

  // Language pill on the right
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#7dd3fc';
  const langText = snippet.language.toUpperCase();
  const langWidth = ctx.measureText(langText).width;
  ctx.fillText(langText, cardX + cardW - langWidth - 18, dotY + 4);

  // Separator line
  ctx.beginPath();
  ctx.moveTo(cardX, cardY + headerHeight);
  ctx.lineTo(cardX + cardW, cardY + headerHeight);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();


  // 3. Render Code Lines
  const contentStartY = cardY + headerHeight + 24;
  const lineHeight = 22;
  const lineNumberGutter = 38;

  snippet.lines.forEach((line, lineIndex) => {
    const currentY = contentStartY + lineIndex * lineHeight;
    if (currentY > cardY + cardH - 14) return; // Prevent overflow

    // Line number
    ctx.font = '400 12px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.textAlign = 'right';
    ctx.fillText(String(lineIndex + 1), cardX + lineNumberGutter, currentY);

    // Code Tokens
    ctx.textAlign = 'left';
    let currentX = cardX + lineNumberGutter + 14;

    line.forEach((token) => {
      ctx.font = '400 13px "JetBrains Mono", monospace';
      ctx.fillStyle = getTokenColor(token.type);
      ctx.fillText(token.text, currentX, currentY);
      currentX += ctx.measureText(token.text).width;
    });
  });

  ctx.restore();
}

function getTokenColor(type: string): string {
  switch (type) {
    case 'keyword':
      return SYNTAX_PALETTE.sky;
    case 'string':
      return SYNTAX_PALETTE.emerald;
    case 'type':
      return SYNTAX_PALETTE.violet;
    case 'number':
      return SYNTAX_PALETTE.amber;
    case 'comment':
      return SYNTAX_PALETTE.slate;
    case 'dim':
      return SYNTAX_PALETTE.dim;
    case 'plain':
    default:
      return '#e2e8f0';
  }
}
