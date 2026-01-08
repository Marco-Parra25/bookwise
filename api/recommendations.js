import books from "../data/books.seed.json" assert { type: "json" };

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

function toTagArray(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(normalize).filter(Boolean);
  return String(tags)
    .split(",")
    .map((t) => normalize(t))
    .filter(Boolean);
}

function jaccard(aArr, bArr) {
  const a = new Set(aArr);
  const b = new Set(bArr);
  if (a.size === 0 && b.size === 0) return 0;

  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;

  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function scoreBook(profile, book) {
  const pTags = toTagArray(profile.tags);
  const bTags = toTagArray(book.tags);

  let score = 0;

  // 1) similitud por tags (peso alto)
  const sim = jaccard(pTags, bTags);
  score += sim * 100;

  // 2) reglas simples (peso medio)
  const prefersShort = Boolean(profile.prefersShort);
  const difficultyMax = Number(profile.difficultyMax ?? 5);

  if (prefersShort && Number(book.pages ?? 0) > 400) score -= 20;
  if (Number(book.difficulty ?? 3) > difficultyMax) score -= 25;

  // 3) objetivo (pequeño empuje)
  const goal = normalize(profile.goal);
  if (goal === "aprender" || goal === "productividad") {
    if (bTags.includes("no ficcion") || bTags.includes("productividad")) score += 8;
  }
  if (goal === "entretener") {
    if (bTags.includes("aventura") || bTags.includes("suspenso") || bTags.includes("fantasía")) score += 6;
  }

  return { score, sim };
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const profile = req.body ?? {};
  const pTags = toTagArray(profile.tags);

  if (pTags.length === 0) {
    return res.status(400).json({ error: "Profile must include at least 1 tag." });
  }

  const ranked = books
    .map((b) => {
      const { score, sim } = scoreBook(profile, b);
      return {
        ...b,
        score,
        sim,
        why: `Coincide con tus gustos en ${(sim * 100).toFixed(0)}%`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      pages: b.pages,
      difficulty: b.difficulty,
      tags: b.tags,
      why: b.why,
      score: Math.round(b.score),
    }));

  return res.status(200).json({
    recommendations: ranked,
    count: ranked.length,
  });
}
