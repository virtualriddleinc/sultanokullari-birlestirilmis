/* -------------------------------------------------------------------------
   Hero slider geometri sabitleri
   ─────────────────────────────────────────────────────────────────────────
   cerceve_1.png altıgen çerçevesinin iç deliği, 43:24 oranındaki konteyner
   içinde aşağıdaki yüzdelerle konumlanır. Medya yerleştirme (focal point,
   scale) hesapları bu sabitlere dayanır.
   ------------------------------------------------------------------------- */

/* Çerçeve deliğinin konteyner içindeki kapladığı alan (yüzde) */
export const HEXAGON_CLIP_WIDTH_PCT = 45.64; // 100 - 27.18 - 27.18
export const HEXAGON_CLIP_HEIGHT_PCT = 68.69; // 100 - 15.49 - 15.82

/* cerceve_1.png — görünür mermer çerçevenin dış sınırı (opak piksel sınırları) */
export const FRAME_OUTER_WIDTH_PCT = 57.26744186046512;
export const FRAME_OUTER_HEIGHT_PCT = 86.39322916666666;

/* Kart ve medya bloklarının ortak en-boy oranı */
export const CONTAINER_ASPECT_RATIO = 43 / 24;

/* Altıgen deliğin kendi en-boy oranı */
export const HEXAGON_ASPECT_RATIO =
  CONTAINER_ASPECT_RATIO * (HEXAGON_CLIP_WIDTH_PCT / HEXAGON_CLIP_HEIGHT_PCT);

/* Görünür çerçeve dış sınırının konteynere oranı (0–1) */
export const FRAME_OUTER_WIDTH_RATIO = FRAME_OUTER_WIDTH_PCT / 100;
export const FRAME_OUTER_HEIGHT_RATIO = FRAME_OUTER_HEIGHT_PCT / 100;
