from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(f"ERROR: {message}")
    sys.exit(1)


def read_json(path: str):
    file_path = ROOT / path
    if not file_path.exists():
        fail(f"Missing {path}")
    try:
        return json.loads(file_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"{path} is invalid JSON: {exc}")


def require_fields(path: str, rows: list[dict], fields: list[str]) -> None:
    for index, row in enumerate(rows, start=1):
        missing = [field for field in fields if not row.get(field)]
        if missing:
            fail(f"{path} item {index} missing: {', '.join(missing)}")


def validate_sources() -> set[str]:
    sources = read_json("data/sources.json")
    if not isinstance(sources, list):
        fail("data/sources.json must be a list")
    require_fields(
        "data/sources.json",
        sources,
        ["key", "name", "level", "level_label", "status", "best_for", "watch_action", "url", "last_checked"],
    )
    keys = [item["key"] for item in sources]
    if len(keys) != len(set(keys)):
        fail("data/sources.json source keys must be unique")
    for item in sources:
        if not item["url"].startswith(("https://", "http://")):
            fail(f"Source URL is not absolute: {item['key']}")
    return set(keys)


def validate_watchlist(source_keys: set[str]) -> None:
    watchlist = read_json("data/watchlist.json")
    if not isinstance(watchlist, list):
        fail("data/watchlist.json must be a list")
    require_fields(
        "data/watchlist.json",
        watchlist,
        ["title", "level", "priority", "window_type", "summary", "keywords", "action", "source_key"],
    )
    for item in watchlist:
        if item["source_key"] not in source_keys:
            fail(f"Watchlist item references unknown source_key: {item['source_key']}")
        if not isinstance(item["keywords"], list) or not item["keywords"]:
            fail(f"Watchlist item needs keyword list: {item['title']}")


def validate_keyword_search(source_keys: set[str]) -> None:
    keywords = read_json("data/tender-keywords.json")
    lanes = keywords.get("search_lanes")
    if not isinstance(lanes, list) or not lanes:
        fail("data/tender-keywords.json needs search_lanes")
    require_fields(
        "data/tender-keywords.json",
        lanes,
        ["title", "source_key", "level", "level_label", "cadence", "pipeline_key", "intent", "search_url"],
    )
    for lane in lanes:
        if lane["source_key"] not in source_keys:
            fail(f"Keyword lane references unknown source_key: {lane['source_key']}")
        for key in ["place_terms", "domain_terms", "pipeline_terms"]:
            if not isinstance(lane.get(key), list) or not lane[key]:
                fail(f"Keyword lane {lane['title']} needs {key}")


def validate_timeline(source_keys: set[str]) -> None:
    timeline = read_json("data/tender-timeline.json")
    if not timeline.get("pipeline_contract"):
        fail("data/tender-timeline.json needs pipeline_contract")
    records = timeline.get("records")
    if not isinstance(records, list) or not records:
        fail("data/tender-timeline.json needs records")
    require_fields(
        "data/tender-timeline.json",
        records,
        ["id", "title", "level", "level_label", "status", "source_key", "last_checked", "summary", "next_action"],
    )
    record_ids = [item["id"] for item in records]
    if len(record_ids) != len(set(record_ids)):
        fail("data/tender-timeline.json record ids must be unique")
    for record in records:
        if record["source_key"] not in source_keys:
            fail(f"Timeline record references unknown source_key: {record['source_key']}")
        if not isinstance(record.get("pipeline_tags"), list) or not record["pipeline_tags"]:
            fail(f"Timeline record needs pipeline_tags: {record['id']}")


def validate_checklists() -> None:
    checklists = read_json("data/checklists.json")
    for key in ["readiness_steps", "capability_statement", "response_checks", "stop_signs"]:
        if key not in checklists or not checklists[key]:
            fail(f"data/checklists.json missing {key}")
    for step in checklists["readiness_steps"]:
        if not step.get("title") or not step.get("body"):
            fail("Every readiness step needs title and body")


def validate_network() -> None:
    network = read_json("data/network.json")
    if not isinstance(network, list):
        fail("data/network.json must be a list")
    require_fields("data/network.json", network, ["title", "tag", "summary", "url", "repo"])


def validate_local_links() -> None:
    required_pages = [
        "index.html",
        "tender-sources.html",
        "tender-watchlist.html",
        "council-tenders.html",
        "queensland-tenders.html",
        "australian-tenders.html",
        "first-nations-procurement.html",
        "keyword-search.html",
        "bid-readiness.html",
        "network.html",
    ]
    for page in required_pages:
        if not (ROOT / page).exists():
            fail(f"Missing page: {page}")


def validate_heroes() -> None:
    slugs = [
        "home",
        "sources",
        "watchlist",
        "council",
        "queensland",
        "australian",
        "first-nations",
        "bid-readiness",
        "network",
    ]
    for slug in slugs:
        for suffix in ["", "-sm"]:
            path = ROOT / "assets" / "heroes" / f"hero-{slug}{suffix}.webp"
            if not path.exists():
                fail(f"Missing hero image: {path.relative_to(ROOT)}")
            if path.stat().st_size > 180_000:
                fail(f"Hero image too large for fast loading target: {path.relative_to(ROOT)}")


def main() -> None:
    source_keys = validate_sources()
    validate_watchlist(source_keys)
    validate_keyword_search(source_keys)
    validate_timeline(source_keys)
    validate_checklists()
    validate_network()
    validate_local_links()
    validate_heroes()
    print("Validation passed.")


if __name__ == "__main__":
    main()
