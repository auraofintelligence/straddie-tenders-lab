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
      <a href="keyword-search.html">Keyword Search</a>
      <a href="bid-readiness.html">Bid Readiness</a>
      <a href="network.html">Network</a>
    </div>
  </nav>`;

const footerHtml = `
  <p>Straddie Tenders Lab. A public research workbench for tender readiness, not legal or procurement advice.</p>
  <p><a href="https://auraofintelligence.github.io/stradbroke-grants-lab/">Stradbroke Grants Lab</a> | <a href="https://auraofintelligence.github.io/strange-but-true/community-ledger.html">Community Ledger</a> | <a href="network.html">Companion network</a></p>`;

const pageSequence = [
  { file: "index.html", label: "Home" },
  { file: "tender-sources.html", label: "Sources" },
  { file: "tender-watchlist.html", label: "Watchlist" },
  { file: "council-tenders.html", label: "Council" },
  { file: "queensland-tenders.html", label: "Queensland" },
  { file: "australian-tenders.html", label: "Australian" },
  { file: "first-nations-procurement.html", label: "First Nations" },
  { file: "keyword-search.html", label: "Keyword Search" },
  { file: "bid-readiness.html", label: "Bid Readiness" },
  { file: "network.html", label: "Network" },
];

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

function renderFooterPageNav() {
  const currentIndex = pageSequence.findIndex((page) => page.file === currentFile);
  if (currentIndex < 0) return;
  const previous = pageSequence[currentIndex - 1];
  const next = pageSequence[currentIndex + 1];
  const previousControl = previous
    ? `<a class="page-step page-step-prev" href="${previous.file}"><span>Previous</span><strong>&larr; ${escapeHtml(previous.label)}</strong></a>`
    : `<span class="page-step page-step-disabled"><span>Previous</span><strong>Start</strong></span>`;
  const nextControl = next
    ? `<a class="page-step page-step-next" href="${next.file}"><span>Next</span><strong>${escapeHtml(next.label)} &rarr;</strong></a>`
    : `<span class="page-step page-step-disabled"><span>Next</span><strong>End</strong></span>`;
  const markup = `<nav class="footer-page-nav" aria-label="Previous and next pages">${previousControl}${nextControl}</nav>`;
  document.querySelectorAll(".site-footer").forEach((footer) => {
    if (!footer.querySelector(".footer-page-nav")) footer.insertAdjacentHTML("afterbegin", markup);
  });
}

renderFooterPageNav();

const topButton = document.querySelector("[data-to-top]");
if (topButton) {
  const updateTopButton = () => topButton.classList.toggle("is-visible", window.scrollY > 620);
  updateTopButton();
  window.addEventListener("scroll", updateTopButton, { passive: true });
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

async function loadJson(path) {
  const embedded = window.STRADDIE_TENDERS_DATA && window.STRADDIE_TENDERS_DATA[path];
  if (window.location.protocol === "file:" && embedded) return embedded;
  try {
    const response = await fetch(path);
    if (response.ok) return response.json();
    if (embedded) return embedded;
    throw new Error(`Could not load ${path}`);
  } catch (error) {
    if (embedded) return embedded;
    throw error;
  }
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

function keywordPill(text) {
  return `<span class="keyword-pill">${escapeHtml(text)}</span>`;
}

async function renderKeywordSearch() {
  const [keywords, timeline, sources] = await Promise.all([
    loadJson("data/tender-keywords.json"),
    loadJson("data/tender-timeline.json"),
    loadJson("data/sources.json"),
  ]);
  const sourceByKey = Object.fromEntries(sources.map((item) => [item.key, item]));
  const searchGrid = document.querySelector("#keywordSearchGrid");
  const timelineGrid = document.querySelector("#timelineGrid");
  const pipelineMeta = document.querySelector("#pipelineMeta");
  if (searchGrid) {
    searchGrid.innerHTML = keywords.search_lanes.map((lane) => {
      const source = sourceByKey[lane.source_key];
      const terms = [...lane.place_terms, ...lane.domain_terms, ...lane.pipeline_terms];
      return `
        <article class="data-card">
          <p class="tag">${escapeHtml(lane.level_label)}</p>
          <h3>${escapeHtml(lane.title)}</h3>
          <p>${escapeHtml(lane.intent)}</p>
          <div class="keyword-cloud">${terms.map(keywordPill).join("")}</div>
          <p class="meta">Cadence: ${escapeHtml(lane.cadence)} | Pipeline: ${escapeHtml(lane.pipeline_key)}</p>
          ${actionLinks([
            { label: "Open official source", url: source && source.url },
            { label: "Open prepared search", url: lane.search_url },
          ])}
        </article>`;
    }).join("");
  }
  if (timelineGrid) {
    timelineGrid.innerHTML = timeline.records.map((record) => {
      const source = sourceByKey[record.source_key];
      return `
        <article class="data-card">
          <p class="tag">${escapeHtml(record.status)}</p>
          <h3>${escapeHtml(record.title)}</h3>
          <p>${escapeHtml(record.summary)}</p>
          <p class="meta">Level: ${escapeHtml(record.level_label)} | Close: ${escapeHtml(record.close_date || "tbc")} | Checked: ${escapeHtml(record.last_checked)}</p>
          <p class="meta">Pipeline tags: ${escapeHtml(record.pipeline_tags.join(", "))}</p>
          ${actionLinks([{ label: "Open source", url: source && source.url }])}
        </article>`;
    }).join("");
  }
  if (pipelineMeta) {
    pipelineMeta.innerHTML = `
      <article class="note-panel">
        <p class="section-label">Pipeline handoff</p>
        <h3>${escapeHtml(timeline.pipeline_contract.name)}</h3>
        <p>${escapeHtml(timeline.pipeline_contract.description)}</p>
        <p class="meta">Updated: ${escapeHtml(timeline.generated_at)} | Next scan: ${escapeHtml(timeline.next_scan_due)}</p>
      </article>`;
  }
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
    if (page === "keyword-search") await renderKeywordSearch();
    if (page === "readiness") await renderReadiness();
    if (page === "network") await renderNetwork();
  } catch (error) {
    const main = document.querySelector("main");
    if (main) main.insertAdjacentHTML("beforeend", `<p class="load-error">${escapeHtml(error.message)}. This page normally loads from the embedded data fallback when opened from a folder. If it still fails, run the local preview from README.md.</p>`);
  }
}

boot();
