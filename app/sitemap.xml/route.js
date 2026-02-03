export const runtime = "edge";

function formatDate(date) {
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

export async function GET() {
  const BASE_URL = "https://www.governmentexam.online";
  const TODAY = formatDate(new Date());

  const GISTS = [
    { url: "https://gist.githubusercontent.com/shahidafridi-collab/9fb5f95e93ed95eba1959d1a18ac6bf7/raw/combine_result", type: "results" },
    { url: "https://gist.githubusercontent.com/shahidafridi-collab/3d4fa23aadd9be02be79a58e46009126/raw/gistfile1.txt", type: "jobs" },
    { url: "https://gist.githubusercontent.com/shahidafridi-collab/d6610e1b9fb8e2617c2999d1edc0851c/raw/gistfile1.txt", type: "admit-cards" },
    { url: "https://gist.githubusercontent.com/shahidafridi-collab/2203569eeb7046f824f7eddb7613d065/raw/gistfile1.txt", type: "admissions" },
    { url: "https://gist.githubusercontent.com/shahidafridi-collab/c687d6e00dcc0a79bd689a520de733c6/raw/syllabus", type: "syllabus" },
    { url: "https://gist.githubusercontent.com/shahidafridi-collab/d5e219d111e2acb930b89d68beb44d92/raw/answerKey", type: "answer-keys" }
  ];

  const urlEntries = [];

  const responses = await Promise.allSettled(
    GISTS.map(g =>
      fetch(g.url, { cache: "no-store" })
        .then(r => r.ok ? r.json() : [])
        .catch(() => [])
    )
  );

  responses.forEach((res, i) => {
    if (res.status !== "fulfilled") return;
    const data = res.value;
    const type = GISTS[i].type;

    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item?.id) {
          urlEntries.push({
            url: `/${type}/${item.id}`,
            lastmod: formatDate(item.updatedDate || item.date || TODAY),
            type
          });
        } else if (item?.link) {
          urlEntries.push({
            url: item.link,
            lastmod: formatDate(item.date || TODAY),
            type
          });
        }
      });
    }
  });

  const staticUrls = [
    "", "/jobs", "/results", "/admit-cards", "/answer-keys",
    "/admissions", "/syllabus", "/about", "/contact",
    "/privacy-policy", "/terms-of-service", "/disclaimer"
  ].map(url => ({
    url,
    lastmod: TODAY,
    type: url === "" ? "home" : "static"
  }));

  const allUrls = [...staticUrls, ...urlEntries];

  const seen = new Set();
  const urlsXml = allUrls
    .filter(e => e.url && !seen.has(e.url) && seen.add(e.url))
    .map(e => {
      const path = e.url.startsWith("/") ? e.url : `/${e.url}`;
      const priority = path === "/" ? "1.0" : path === "/jobs" || path === "/results" ? "0.9" : "0.8";
      const changefreq = e.type === "static" ? "weekly" : "daily";

      return `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
