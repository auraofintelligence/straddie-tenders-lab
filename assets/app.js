const navHtml = `
  <nav class="nav" aria-label="Main navigation">
    <a class="brand-mark" href="index.html"><span>Straddie</span><span>Tenders Lab</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <div class="nav-links" id="nav-links">
      <a href="tender-sources.html">Sources</a>
      <a href="tender-watchlist.html">Watchlist</a>
      <a href="council-tenders.html">Council</a>
      <a href="queensland-tenders.html">Queensland</a>
      <a href="australian-tenders.html">Australian</a>
      <a href="first-nations-procurement.html">First Nations</a>
      <a href="bid-readiness.html">Bid Readiness</a>
      <a href="network.html">Network</a>
    </div>
  </nav>`;

const footerHtml = `
  <p>Straddie Tenders Lab. A public research workbench for tender readiness, not legal or procurement advice.</p>
  <p><a href="https://auraofintelligence.github.io/stradbroke-grants-lab/">Stradbroke Grants Lab</a> | <a href="https://auraofintelligence.github.io/strange-but-true/community-ledger.html">Community Ledger</a> | <a href="network.html">Companion network</a></p>`;

document.querySelectorAll(".site-header").forEach((header) => {
  if (!header.children.length) header.innerHTML = navHtml;
});
document.querySelectorAll(".site-footer").forEach((footer) => {
  if (!footer.children.length) footer.innerHTML = footerHtml;
});

const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const currentFile = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.getAttribute("href") === currentFile) link.setAttribute("aria-current", "page");
});

const topButton = document.querySelector("[data-to-top]");
if (topButton) {
  const updateTopButton = () => topButton.classList.toggle("is-visible", window.scrollY > 620);
  updateTopButton();
  window.addEventListener("scroll", updateTopButton, { passive: true });
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function actionLinks(actions) {
  const filtered = actions.filter((action) => action && action.url);
  if (!filtered.length) return "";
  return `<div class="card-actions">${filtered.map((action) => `<a href="${escapeHtml(action.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(action.label)}</a>`).join("")}</div>`;
}

function sourceCard(item) {
  return `
    <article class="data-card">
      <p class="tag">${escapeHtml(item.level_label)}</p>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.best_for)}</p>
      <p class="meta">${escapeHtml(item.status)} | ${escapeHtml(item.last_checked)}</p>
      ${actionLinks([{ label: "Open official source", url: item.url }])}
    </article>`;
}

function watchCard(item, source) {
  const sourceUrl = source ? source.url : "";
  return `
    <article class="data-card">
      <p class="tag">${escapeHtml(item.priority)}</p>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <p class="meta">Window: ${escapeHtml(item.window_type)} | Keywords: ${escapeHtml(item.keywords.join(", "))}</p>
      <p class="meta">${escapeHtml(item.action)}</p>
      ${actionLinks([{ label: "Open source", url: sourceUrl }])}
    </article>`;
}

function networkCard(item) {
  return `
    <article class="data-card">
      <p class="tag">${escapeHtml(item.tag)}</p>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      ${actionLinks([
        { label: "Open public page", url: item.url },
        { label: "Open repo", url: item.repo },
      ])}
    </article>`;
}

function renderFilter(container, labels, onSelect) {
  if (!container) return;
  container.innerHTML = ["all", ...labels].map((label, index) => `<button type="button" class="${index === 0 ? "is-active" : ""}" data-filter="${escapeHtml(label)}">${escapeHtml(label === "all" ? "All" : label)}</button>`).join("");
  container.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    container.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
    onSelect(button.dataset.filter);
  });
}

async function renderHome() {
  const [sources, watchlist, network] = await Promise.all([
    loadJson("data/sources.json"),
    loadJson("data/watchlist.json"),
    loadJson("data/network.json"),
  ]);
  const stats = document.querySelector("#homeStats");
  if (stats) {
    stats.innerHTML = [
      ["Source surfaces", sources.length, "Official tender, policy and place-context links."],
      ["Watch lanes", watchlist.length, "Calm search routes instead of panic-refreshing everything."],
      ["Companion repos", network.length, "Grants, ledger, moonshots, sand and Straddie systems."],
    ].map(([title, count, body]) => `<article class="mini-card"><p class="tag">${count}</p><h3>${title}</h3><p>${body}</p></article>`).join("");
  }
  const networkPreview = document.querySelector("#networkPreview");
  if (networkPreview) {
    networkPreview.innerHTML = network.slice(0, 4).map(networkCard).join("");
  }
}

async function renderSources() {
  const sources = await loadJson("data/sources.json");
  const grid = document.querySelector("#sourceGrid");
  const fixedLevel = document.body.dataset.sourceLevel || "";
  if (grid) {
    const draw = (filter = "all") => {
      const level = fixedLevel || filter;
      const items = level === "all" ? sources : sources.filter((item) => item.level === level);
      grid.innerHTML = items.map(sourceCard).join("");
    };
    if (!fixedLevel) {
      const labels = [...new Set(sources.map((item) => item.level))].sort();
      renderFilter(document.querySelector("#sourceFilters"), labels, draw);
    }
    draw(fixedLevel || "all");
  }
  const placeGrid = document.querySelector("#placeSourceGrid");
  if (placeGrid) {
    placeGrid.innerHTML = sources.filter((item) => item.level === "place").map(sourceCard).join("");
  }
}

async function renderWatchlist() {
  const [watchlist, sources] = await Promise.all([loadJson("data/watchlist.json"), loadJson("data/sources.json")]);
  const sourceByKey = Object.fromEntries(sources.map((item) => [item.key, item]));
  const grid = document.querySelector("#watchlistGrid");
  if (!grid) return;
  grid.innerHTML = watchlist.map((item) => watchCard(item, sourceByKey[item.source_key])).join("");
}

async function renderReadiness() {
  const data = await loadJson("data/checklists.json");
  const steps = document.querySelector("#readinessSteps");
  if (steps) {
    steps.innerHTML = data.readiness_steps.map((step, index) => `
      <article class="data-card step-card">
        <span class="step-number">${index + 1}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.body)}</p>
      </article>`).join("");
  }
  [["capabilityList", data.capability_statement], ["responseChecks", data.response_checks], ["stopSigns", data.stop_signs]].forEach(([id, items]) => {
    const list = document.querySelector(`#${id}`);
    if (list) list.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  });
}

async function renderNetwork() {
  const network = await loadJson("data/network.json");
  const grid = document.querySelector("#networkGrid");
  if (grid) grid.innerHTML = network.map(networkCard).join("");
}

async function boot() {
  try {
    const page = document.body.dataset.page;
    if (page === "home") await renderHome();
    if (page === "sources" || page === "source-level") await renderSources();
    if (page === "watchlist") await renderWatchlist();
    if (page === "readiness") await renderReadiness();
    if (page === "network") await renderNetwork();
  } catch (error) {
    const main = document.querySelector("main");
    if (main) main.insertAdjacentHTML("beforeend", `<p class="load-error">${escapeHtml(error.message)}. If you opened the file directly, run a local server first.</p>`);
  }
}

boot();
