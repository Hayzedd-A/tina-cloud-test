import crypto from "crypto";

const PIXEL_ID = "1850287295460876";
const META_ENDPOINT = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

// Disable Next.js body parsing so we can read the raw body for sig verification
export const config = { api: { bodyParser: true } };

function sha256(value) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function sha256Raw(value) {
  return crypto.createHash("sha256").update(value.trim()).digest("hex");
}

// Nigeria phone → E.164 digits only (no +)
function normalizePhone(p) {
  let d = p.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 11) d = "234" + d.slice(1);
  else if (d.length === 10) d = "234" + d;
  return d;
}

function verifySecret(req) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true; // skip verification if not configured (dev only)
  const received = req.headers["x-webhook-secret"];
  return received === secret;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifySecret(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.error("[CAPI] META_CAPI_TOKEN not set");
    return res.status(500).json({ error: "CAPI token not configured" });
  }

  const body = req.body;

  // Validate required fields
  if (!body?.orderId || !body?.amount) {
    return res.status(400).json({ error: "Missing required fields: orderId, amount" });
  }

  try {
    const user_data = {};

    if (body.customer?.email) {
      user_data.em = [sha256(body.customer.email)];
    }

    if (body.customer?.phone) {
      user_data.ph = [sha256Raw(normalizePhone(body.customer.phone))];
    }

    // fbp and fbc are NOT hashed — passed as-is
    if (body.tracking?.fbp) user_data.fbp = body.tracking.fbp;
    if (body.tracking?.fbc) user_data.fbc = body.tracking.fbc;
    if (body.tracking?.clientIp) user_data.client_ip_address = body.tracking.clientIp;
    if (body.tracking?.clientUserAgent) user_data.client_user_agent = body.tracking.clientUserAgent;

    const contentIds = (body.orderItems || []).map((item) => item.productId);
    const numItems = (body.orderItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: body.paidAt
            ? Math.floor(new Date(body.paidAt).getTime() / 1000)
            : Math.floor(Date.now() / 1000),
          event_id: body.orderId, // deduplication key — same as what browser eventID would use
          action_source: "website",
          event_source_url: body.tracking?.sourceUrl || "https://gourmettwist.com/cart",
          user_data,
          custom_data: {
            value: Number(body.amount),
            currency: "NGN",
            content_ids: contentIds,
            content_type: "product",
            num_items: numItems,
            order_id: body.orderId,
          },
        },
      ],
    };

    // Uncomment to test in Meta Events Manager without affecting real data:
    // payload.test_event_code = "TESTxxxxx";

    const metaRes = await fetch(`${META_ENDPOINT}?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const metaBody = await metaRes.json();

    if (!metaRes.ok) {
      console.error("[CAPI] Meta rejected event:", metaBody);
      return res.status(502).json({ error: "Meta CAPI error", detail: metaBody });
    }

    console.log("[CAPI] Purchase fired for order", body.orderId, metaBody);
    return res.status(200).json({ ok: true, events_received: metaBody.events_received });
  } catch (err) {
    console.error("[CAPI] Unexpected error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
