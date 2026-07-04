# Weekly Tender Search Agent Brief

Use this brief for the weekly Straddie Tenders Lab refresh.

## Goal

Run repeatable keyword searches across official tender and procurement sources, then update the public data files so other pipelines can act on clean tender timelines.

## Files To Update

- `data/tender-keywords.json`: search lanes. Update only when the search strategy changes.
- `data/tender-timeline.json`: current, upcoming, awarded or learning records. Update every scan.
- `data/watchlist.json`: public source-watch summaries if the broad watch lane changes.
- `assets/data.js`: regenerate after data changes so the site works from GitHub Pages and when opened from a folder.

## Search Order

1. Redland City Council current and upcoming tenders.
2. Redland City Council VendorPanel and doing-business guidance.
3. QTenders and Queensland Government tender guidance.
4. Queensland supplier portal and forward procurement context.
5. AusTender current Approaches to Market, planned procurements and contract notices.
6. Indigenous procurement policy and First Nations business participation sources.

## Search Terms

Use the lanes in `data/tender-keywords.json`.

Combine place terms with domain terms. Examples:

- `Minjerribah tourism`
- `North Stradbroke ferry`
- `Redland digital inclusion`
- `Quandamooka ranger`
- `Queensland protected area`
- `Indigenous Procurement Policy Queensland`

## Record Rules

- Add only source-backed records.
- Keep grants separate from tenders.
- Keep policies and strategy pages separate from open opportunities.
- Use `source-watch` when no specific opportunity is open.
- Use `open`, `upcoming`, `closing-soon`, `awarded`, `closed`, or `learning-record` for specific records.
- Use `tbc` when an official source does not give a date.
- Do not invent eligibility, partnership approval, cultural authority, budget, contact names or dates.
- First Nations and Country-related records must include permission and authority caution in `next_action`.

## Pipeline Tags

Use only tags that downstream systems can understand:

- `grants`
- `ledger`
- `events`
- `noticeboard`
- `film-club`
- `cinematic-universe`
- `game-world`
- `web3-theory`
- `resilience`
- `digital-twin`
- `mineral-moonshots`
- `civilisation-of-sand`
- `aura`

## Required Checks

Run:

```powershell
python tools\build_embedded_data.py
python tools\validate_data.py
node --check assets\app.js
node --check assets\data.js
git diff --check
```

## Publish Rule

If records changed and validation passes, commit with a plain message such as:

```text
Refresh tender timeline
```

Then push to GitHub so `data/tender-timeline.json` is available to other pipelines.
