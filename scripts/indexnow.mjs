/**
 * Submits every public URL to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to rediscover
 * a changed page, you tell the engine directly. Google does not participate,
 * but Bing and Yandex do — and Bing's index is what backs Microsoft Copilot,
 * so this is inexpensive coverage on an AI surface.
 *
 * Run AFTER deploying, not as part of the build: the key file and the updated
 * pages must already be live, or the submission is rejected.
 *
 *   npm run indexnow
 */
import { ROUTES, INDEXNOW_KEY, absoluteUrl, normalizeSiteUrl } from "../src/lib/site.config.mjs";

const SITE_URL = normalizeSiteUrl(process.env.VITE_SITE_URL || process.env.SITE_URL);
const host = new URL(SITE_URL).host;

async function main() {
  if (!INDEXNOW_KEY) {
    console.error("indexnow: no INDEXNOW_KEY set in site.config.mjs");
    process.exit(1);
  }

  // Confirm the key file is actually reachable before submitting — a missing
  // key file is the usual reason submissions silently fail verification.
  const keyUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
  const keyRes = await fetch(keyUrl).catch(() => null);
  if (!keyRes || !keyRes.ok) {
    console.error(
      `indexnow: key file not reachable at ${keyUrl}\n` +
        "Deploy first — IndexNow verifies ownership by fetching that file."
    );
    process.exit(1);
  }

  const urlList = ROUTES.map((r) => absoluteUrl(SITE_URL, r.path));

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: keyUrl,
      urlList,
    }),
  });

  // 200 = accepted, 202 = accepted pending key validation. Both are success.
  if (res.status === 200 || res.status === 202) {
    console.log(`indexnow: submitted ${urlList.length} URLs for ${host} (HTTP ${res.status})`);
  } else {
    console.error(`indexnow: rejected with HTTP ${res.status}`);
    console.error(await res.text().catch(() => ""));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("indexnow failed:", err.message);
  process.exit(1);
});
