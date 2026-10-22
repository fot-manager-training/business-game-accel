// Runs on the GitHub runner after deployment to verify the actual public files.
const site = new URL(process.env.PAGES_URL);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function get(url) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const response = await fetch(url, { redirect: "follow" });
    if (response.ok) return response;
    if (attempt === 7) throw new Error(`${url}: HTTP ${response.status}`);
    await pause(5000);
  }
}
const html = await (await get(site)).text();
if (
  !html.includes("ZERO — Zero Human Company Workshop") ||
  !html.includes('id="root"')
)
  throw new Error("Published document is not the ZERO app");
const script = html.match(/<script[^>]+src="([^"]+\.js)"/);
const style = html.match(/<link[^>]+href="([^"]+\.css)"/);
if (!script || !style) throw new Error("Published document is missing JS/CSS");
for (const path of [script[1], style[1]]) {
  const url = new URL(path, site);
  if (url.origin !== site.origin || !url.pathname.startsWith(site.pathname))
    throw new Error(`Invalid asset base: ${url}`);
  const response = await get(url);
  if (
    !(response.headers.get("content-type") || "").includes(
      path.endsWith(".js") ? "javascript" : "css",
    )
  )
    throw new Error(`Unexpected content type for ${url}`);
}
const css = await (await get(new URL(style[1], site))).text();
const font = css.match(/url\(["']?([^\s)"']+\.ttf)["']?\)/);
if (!font) throw new Error("Local font missing from published stylesheet");
await get(new URL(font[1], new URL(style[1], site)));
console.log(`Public ZERO demo verified: ${site}`);
