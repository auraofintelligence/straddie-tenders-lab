# Tender Watchlist Agent Brief

Use this brief when refreshing the Straddie Tenders Lab source watch.

## Goal

Refresh tender and procurement source notes for North Stradbroke Island / Minjerribah without inventing opportunities or overstating eligibility.

## Source Order

1. Redland City Council current and upcoming tenders.
2. Redland City Council VendorPanel and doing-business guidance.
3. Queensland Government tender guidance, QTenders, eTender and supplier portal.
4. AusTender current Approaches to Market, planned procurements and contract notices.
5. Indigenous procurement policy and First Nations business participation sources.
6. Minjerribah place context sources only where they help interpret the local opportunity.

## Rules

- Add only source-backed records.
- Keep each `source_key` tied to one real source.
- Do not treat grants as tenders.
- Do not treat a policy, media release or project page as an open tender.
- Do not claim cultural authority, partnership approval or First Nations eligibility unless the source and applicant facts support it.
- If a tender is closed, use it only for learning unless a new round is officially open.
- Use `tbc` for uncertain dates instead of guessing.

## Output

Update:

- `data/sources.json`
- `data/watchlist.json`

Then run:

```powershell
python tools/validate_data.py
```
