# Straddie Tenders Lab

A standalone public research workbench for North Stradbroke Island / Minjerribah government tenders, procurement pathways and bid readiness.

This sits beside the Stradbroke Grants Lab. Grants are funding programs. Tenders are buying processes: government is asking suppliers to provide goods, services, works, advice or capability.

## Local Preview

From this folder:

```powershell
python -m http.server 4188
```

Then open:

```text
http://localhost:4188/
```

## Main Pages

- `index.html`: public entry point.
- `tender-sources.html`: source ladder across Council, Queensland, Australian Government and First Nations procurement.
- `tender-watchlist.html`: calm source-watch list for upcoming, open, closing and awarded opportunities.
- `council-tenders.html`: Redland City Council and VendorPanel lane.
- `queensland-tenders.html`: QTenders, eTender, supplier portal and Queensland procurement policy lane.
- `australian-tenders.html`: AusTender and federal supplier lane.
- `first-nations-procurement.html`: Indigenous procurement, cultural authority and partnership-readiness lane.
- `bid-readiness.html`: plain-English readiness steps, capability statement prompts and response checks.
- `network.html`: reciprocal project map for grants, ledger, Mineral Moonshots, Civilisation of Sand and related Straddie labs.

## Data Files

- `data/sources.json`: official tender, procurement and place-context sources.
- `data/watchlist.json`: source watches and keyword routes.
- `data/checklists.json`: bid-readiness steps and response checks.
- `data/network.json`: companion repo links and why each one matters.

## Hero Images

Each main page has a unique AI-generated cinematic hero image in `assets/heroes/`.

The production images are WebP files in two sizes:

- `hero-name.webp`: desktop image, 1600 x 900.
- `hero-name-sm.webp`: smaller image, 960 x 540.

The original generated PNGs remain in Codex's generated image folder and are not committed here.

## Validation

Run:

```powershell
python tools/validate_data.py
```

The validation checks required JSON fields, local links and hero assets.

## Public Boundary

This lab is an information and preparation surface, not legal, financial or procurement advice. Every tender should be checked on the live official portal before anyone spends serious time preparing a response.
