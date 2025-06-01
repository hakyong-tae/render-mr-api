const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/proxy/myresult-races", async (req, res) => {
  try {
    const protocol = process.env.USE_HTTP_ONLY === "true" ? "http" : "https";

    // ✅ ESM 대응 방식
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(`${protocol}://myresult.co.kr/api/event/`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("/myresult-races fetch error:", err);
    res.status(500).json({ error: "Failed to fetch races from MyResult." });
  }
});

app.get("/api/proxy/myresult-record", async (req, res) => {
  const { eventId, bibNo } = req.query;
  if (!eventId || !bibNo) return res.status(400).json({ error: "Missing eventId or bibNo" });

  try {
    const fetch = (await import("node-fetch")).default;

    const url = `https://myresult.co.kr/api/event/${eventId}/player/${bibNo}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("/myresult-record fetch error:", err);
    res.status(500).json({ error: "Failed to fetch record from MyResult." });
  }
});

app.get("/", (req, res) => {
  res.send("MyResult Proxy API is running");
});

app.listen(PORT, () => {
  console.log(`✅ Render Proxy Server running on port ${PORT}`);
});
