/**
 * Düz üst (flat-top) altıgen petek yerleşimi.
 * Sütunlar yatayda 0.75·W, satırlar dikeyde √3/2·W (konteyner genişliğine göre).
 */

const SQRT3 = Math.sqrt(3);
const HEX_HEIGHT_RATIO = SQRT3 / 2;

export const FLAT_TOP_HEX_RATIO = `2 / ${SQRT3}`;
export const FLAT_TOP_HEX_ASPECT_NUMBER = 2 / SQRT3;

const FLAT_TOP_HEX_VERTICES: readonly (readonly [number, number])[] = [
  [25, 0],
  [75, 0],
  [100, 50],
  [75, 100],
  [25, 100],
  [0, 50],
] as const;

const HEX_CLIP_CENTER: readonly [number, number] = [50, 50];

/** Subpiksel anti-alias boşlukları için hafif clip genişletmesi — konumlandırmayı değiştirmez. */
const HEX_CLIP_BLEED = 0.015;

function expandHexClipVertex([x, y]: readonly [number, number]) {
  const [cx, cy] = HEX_CLIP_CENTER;
  return [
    cx + (x - cx) * (1 + HEX_CLIP_BLEED),
    cy + (y - cy) * (1 + HEX_CLIP_BLEED),
  ] as const;
}

export const FLAT_TOP_HEX_CLIP = `polygon(${FLAT_TOP_HEX_VERTICES.map((vertex) => {
  const [x, y] = expandHexClipVertex(vertex);
  return `${x.toFixed(4)}% ${y.toFixed(4)}%`;
}).join(", ")})`;

export type FlatTopHoneycombCellPosition = {
  left: number;
  top: number;
  width: number;
};

export type FlatTopHoneycombLayout = {
  cols: number;
  rowSpan: number;
  cellWidthPct: number;
  containerHeightPctOfWidth: number;
  aspectRatio: string;
  aspectRatioNumber: number;
  cellPosition(col: number, row: number): FlatTopHoneycombCellPosition;
};

/**
 * @param cols Yatay hücre sayısı
 * @param rowSpan Dikey kapsam (satır birimi). Petek ofseti için +0.5 pay (ör. 3.5).
 */
export function buildFlatTopHoneycombLayout(
  cols: number,
  rowSpan: number,
): FlatTopHoneycombLayout {
  const cellWidthPct = 100 / (1 + (cols - 1) * 0.75);
  const cellHeightPctOfWidth = cellWidthPct * HEX_HEIGHT_RATIO;
  const containerHeightPctOfWidth = rowSpan * cellHeightPctOfWidth;
  const aspectRatioNumber = 100 / containerHeightPctOfWidth;

  return {
    cols,
    rowSpan,
    cellWidthPct,
    containerHeightPctOfWidth,
    aspectRatio: `100 / ${containerHeightPctOfWidth.toFixed(6)}`,
    aspectRatioNumber,
    cellPosition(col: number, row: number) {
      const left = col * 0.75 * cellWidthPct;
      const topInWidth = row * cellHeightPctOfWidth;
      const top = (topInWidth / containerHeightPctOfWidth) * 100;
      return { left, top, width: cellWidthPct };
    },
  };
}

/**
 * Gâyemiz / Nebevî 7-hücre peteği.
 * 3 sütun; satır 0–2 (üst/alt hücre sınırı konteynerin %0–%100’ü).
 */
export const MISSION_HONEYCOMB_LAYOUT = buildFlatTopHoneycombLayout(3, 3);

/** globals.css ile senkron — layout modülünden türetilir */
export const MISSION_HONEYCOMB_ASPECT_CSS = MISSION_HONEYCOMB_LAYOUT.aspectRatio;
