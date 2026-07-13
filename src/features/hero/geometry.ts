/* -------------------------------------------------------------------------
   Hero slider geometri sabitleri
   ─────────────────────────────────────────────────────────────────────────
   cini-cerceve.png altıgen çerçevesinin iç deliği, görselin doğal oranındaki
   konteyner içinde aşağıdaki yüzdelerle konumlanır. Medya yerleştirme (focal
   point, scale) hesapları bu sabitlere dayanır.
   ------------------------------------------------------------------------- */

/* cini-cerceve.png kaynak piksel boyutu */
export const FRAME_IMAGE_WIDTH = 1563;
export const FRAME_IMAGE_HEIGHT = 1331;

/* Çerçeve deliğinin konteyner içindeki kapladığı alan (yüzde) */
export const HEXAGON_CLIP_WIDTH_PCT = 79.9104286628279;
export const HEXAGON_CLIP_HEIGHT_PCT = 79.11344853493614;

/* cini-cerceve.png — görünür çini çerçevenin dış sınırı (opak piksel sınırları) */
export const FRAME_OUTER_WIDTH_PCT = 99.87204094689699;
export const FRAME_OUTER_HEIGHT_PCT = 99.69947407963937;

/* Altıgen deliğin konteyner kenarlarından içe çekilmesi (yüzde) — bbox referansı */
export const HEX_MASK_INSET = {
  left: 10.044785668586051,
  right: 10.044785668586051,
  top: 10.368144252441773,
  bottom: 10.518407212622089,
} as const;

/*
 * cini-cerceve.png iç deliği — opak sınır analizi (piksel → konteyner %)
 * Saat yönü: sol-üst omuz → sağ-üst → sağ → sağ-alt → sol-alt → sol
 */
const HEX_CLIP_VERTICES = [
  [29.3666, 10.6687],
  [70.5694, 10.5935],
  [89.8912, 50.0376],
  [70.3135, 89.3313],
  [29.5585, 89.2562],
  [10.0448, 50.1127],
] as const;

const HEX_CLIP_CENTER = [50, 50] as const;

/** Delik clip'ini merkezden dışa genişlet — anti-alias / subpiksel boşluk telafisi */
const HEX_CLIP_BLEED = 0.015;

function expandHexClipVertex([x, y]: readonly [number, number]) {
  const [cx, cy] = HEX_CLIP_CENTER;
  return [
    cx + (x - cx) * (1 + HEX_CLIP_BLEED),
    cy + (y - cy) * (1 + HEX_CLIP_BLEED),
  ] as const;
}

export const HEX_CLIP_PATH = `polygon(${HEX_CLIP_VERTICES.map((vertex) => {
  const [x, y] = expandHexClipVertex(vertex);
  return `${x.toFixed(4)}% ${y.toFixed(4)}%`;
}).join(", ")})`;

/**
 * Altıgen delik clip'i — delik bbox'una göre (0–100%).
 * Admin odak reticle kenarı için; konteyner HEX_CLIP_PATH ile karıştırma.
 */
export const HEX_HOLE_CLIP_PATH = `polygon(${HEX_CLIP_VERTICES.map(([x, y]) => {
  const lx =
    ((x - HEX_MASK_INSET.left) / HEXAGON_CLIP_WIDTH_PCT) * 100;
  const ly =
    ((y - HEX_MASK_INSET.top) / HEXAGON_CLIP_HEIGHT_PCT) * 100;
  return `${lx.toFixed(4)}% ${ly.toFixed(4)}%`;
}).join(", ")})`;

/** Medya — çerçeve iç kenarında yeşil çizgi kalmaması için merkezden büyütme */
export const HEX_MEDIA_COVER_SCALE = 1.035;

/* Kart ve medya bloklarının ortak en-boy oranı — çerçeve PNG ile birebir */
export const CONTAINER_ASPECT_RATIO = FRAME_IMAGE_WIDTH / FRAME_IMAGE_HEIGHT;

/* Altıgen deliğin kendi en-boy oranı */
export const HEXAGON_ASPECT_RATIO =
  CONTAINER_ASPECT_RATIO * (HEXAGON_CLIP_WIDTH_PCT / HEXAGON_CLIP_HEIGHT_PCT);

/* Görünür çerçeve dış sınırının konteynere oranı (0–1) */
export const FRAME_OUTER_WIDTH_RATIO = FRAME_OUTER_WIDTH_PCT / 100;
export const FRAME_OUTER_HEIGHT_RATIO = FRAME_OUTER_HEIGHT_PCT / 100;
