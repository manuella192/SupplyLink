require("dotenv").config();

const MODELS = [
  "tencent/hy3:free",
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "cohere/north-mini-code:free",
  "nvidia/llama-nemotron-rerank-vl-1b-v2:free",
  "poolside/laguna-xs-2.1:free",
  "openrouter/free",
];

const TEST_MSG = "En une phrase courte, dis-moi ce qu'est une marketplace en ligne.";

const test = async (model) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: TEST_MSG }],
        max_tokens: 80,
        stream: false,
      }),
    });
    clearTimeout(timer);
    const text = await res.text();
    if (!res.ok) {
      let msg = text;
      try { msg = JSON.parse(text)?.error?.message || text; } catch {}
      return { ok: false, status: res.status, info: msg.slice(0, 120) };
    }
    let data;
    try { data = JSON.parse(text); } catch { return { ok: false, status: res.status, info: "JSON invalide" }; }
    const reply = data.choices?.[0]?.message?.content?.trim() || "(réponse vide)";
    return { ok: true, status: res.status, info: reply.slice(0, 120) };
  } catch (e) {
    clearTimeout(timer);
    const info = e.name === "AbortError" ? "TIMEOUT (>20s)" : e.message;
    return { ok: false, status: 0, info };
  }
};

(async () => {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) { console.error("OPENROUTER_API_KEY manquante dans .env"); process.exit(1); }

  console.log("═══════════════════════════════════════════════════");
  console.log(" Test des modèles OpenRouter");
  console.log("═══════════════════════════════════════════════════\n");

  for (const model of MODELS) {
    process.stdout.write(`▶ ${model}\n  → `);
    const r = await test(model);
    const icon = r.ok ? "✅" : "❌";
    console.log(`${icon} [${r.status}] ${r.info}\n`);
  }

  console.log("═══════════════════════════════════════════════════");
  console.log("Terminé.");
})();
