const ALLOWED = {
  DGS10: { label: "10Y Treasury yield", units: "lin", suffix: "%" },
  DGS2: { label: "2Y Treasury yield", units: "lin", suffix: "%" },
  FEDFUNDS: { label: "Fed funds rate", units: "lin", suffix: "%" },
  CPIAUCSL: { label: "CPI inflation (YoY)", units: "pc1", suffix: "%" },
  UNRATE: { label: "Unemployment rate", units: "lin", suffix: "%" },
  PCEPI: { label: "PCE inflation (YoY)", units: "pc1", suffix: "%" }
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.FRED_API_KEY;
  if (!key) return res.status(503).json({ error: "FRED_API_KEY is not configured on the server." });

  const requested = String(req.query.ids || "DGS10,DGS2,FEDFUNDS,CPIAUCSL,UNRATE,PCEPI")
    .split(",").map(x => x.trim().toUpperCase()).filter(Boolean);
  const ids = [...new Set(requested)].filter(id => Object.prototype.hasOwnProperty.call(ALLOWED, id));
  if (!ids.length) return res.status(400).json({ error: "No supported FRED series requested." });

  try {
    const results = await Promise.all(ids.map(async id => {
      const config = ALLOWED[id];
      const url = new URL("https://api.stlouisfed.org/fred/series/observations");
      url.search = new URLSearchParams({
        series_id: id,
        api_key: key,
        file_type: "json",
        units: config.units,
        sort_order: "desc",
        limit: "2"
      }).toString();

      const response = await fetch(url);
      if (!response.ok) throw new Error("FRED request failed for " + id);
      const payload = await response.json();
      const valid = (payload.observations || [])
        .filter(row => row.value !== "." && Number.isFinite(Number(row.value)));
      const latest = valid[0];
      const previous = valid[1];
      return {
        id,
        label: config.label,
        date: latest ? latest.date : null,
        value: latest ? Number(latest.value) : null,
        previousDate: previous ? previous.date : null,
        previousValue: previous ? Number(previous.value) : null,
        units: config.suffix
      };
    }));

    return res.status(200).json({ source: "Federal Reserve Bank of St. Louis (FRED)", updatedAt: new Date().toISOString(), series: results });
  } catch (error) {
    return res.status(502).json({ error: "Unable to retrieve FRED observations. Try again shortly." });
  }
};
