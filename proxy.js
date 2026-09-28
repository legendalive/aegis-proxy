export default async function handler(req, res) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-MBX-APIKEY,X-Target-Base"
  };

  if (req.method === "OPTIONS") {
    res.status(204);
    Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
    return res.end();
  }

  try {
    const target = req.headers["x-target-base"] || "https://testnet.binance.vision";
    const url = target + req.url;

    const headers = {};
    if (req.headers["x-mbx-apikey"]) {
      headers["X-MBX-APIKEY"] = req.headers["x-mbx-apikey"];
    }

    const upstream = await fetch(url, { method: req.method, headers });
    const text = await upstream.text();

    Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (e) {
    res.status(500);
    return res.json({ error: String(e) });
  }
}
