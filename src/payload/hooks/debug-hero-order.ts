import type { CollectionBeforeChangeHook } from "payload";
import { appendFileSync } from "fs";

const DEBUG_ENDPOINT =
  "http://127.0.0.1:7784/ingest/96a548f3-a067-41cd-8ac0-173dd52159a6";
const DEBUG_LOG =
  "/Users/virtualriddle/Desktop/Sultan Okulları Resmî Web Sitesi/birlestirme/.cursor/debug-9ca975.log";

function agentLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
) {
  const payload = {
    sessionId: "9ca975",
    runId: "post-fix",
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  };
  // #region agent log
  try {
    appendFileSync(DEBUG_LOG, `${JSON.stringify(payload)}\n`);
  } catch {
    // ignore FS errors
  }
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "9ca975",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion
}

/**
 * Debug: hero-slides create 500.
 * H-A: Eski LPAD migration (0000000005) fractional indexing ile uyumsuz.
 * H-B: Create sırasında lastOrder validate edilince patlıyor.
 * H-C: Media/alt/hook değil, order beforeChange.
 */
export const debugHeroSlideOrderBeforeChange: CollectionBeforeChangeHook =
  async ({ data, operation, req, originalDoc }) => {
    if (operation !== "create" && operation !== "update") return data;

    try {
      const existing = await req.payload.find({
        collection: "hero-slides",
        depth: 0,
        limit: 50,
        pagination: false,
        sort: "-_order",
        select: { _order: true, tagline: true },
        overrideAccess: true,
        req,
      });

      const orders = existing.docs.map((d) => ({
        id: d.id,
        _order: (d as { _order?: string | null })._order ?? null,
        tagline: (d as { tagline?: string }).tagline ?? null,
      }));

      const lastOrder = orders[0]?._order ?? null;
      const looksPadded =
        typeof lastOrder === "string" && /^0+\d+$/.test(lastOrder);

      // head '0' expects 11-char integer part; padded keys are 10 → invalid
      const headLen =
        typeof lastOrder === "string" && lastOrder[0] >= "0" && lastOrder[0] <= "9"
          ? 11 - (lastOrder.charCodeAt(0) - "0".charCodeAt(0))
          : null;
      const keyTooShort =
        typeof lastOrder === "string" &&
        headLen != null &&
        lastOrder.length < headLen;

      agentLog(
        "A",
        "debug-hero-order.ts:beforeChange",
        "hero-slides order state before Payload order hook",
        {
          operation,
          lastOrder,
          looksPadded,
          keyTooShort,
          headLen,
          keyLen: typeof lastOrder === "string" ? lastOrder.length : null,
          orderCount: orders.length,
          sampleOrders: orders.slice(0, 8),
          incomingHasOrder: Boolean(
            (data as { _order?: string })._order,
          ),
          originalHasOrder: Boolean(
            (originalDoc as { _order?: string } | undefined)?._order,
          ),
        },
      );

      if (looksPadded || keyTooShort) {
        agentLog(
          "B",
          "debug-hero-order.ts:beforeChange",
          "CONFIRMED candidate: invalid padded _order will break generateKeyBetween",
          { lastOrder, looksPadded, keyTooShort },
        );
      }
    } catch (err) {
      agentLog("C", "debug-hero-order.ts:beforeChange", "debug hook failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return data;
  };
