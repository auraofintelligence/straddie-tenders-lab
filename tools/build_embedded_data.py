from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILES = [
    "data/sources.json",
    "data/watchlist.json",
    "data/checklists.json",
    "data/network.json",
    "data/tender-keywords.json",
    "data/tender-timeline.json",
]


def main() -> None:
    payload = {}
    for relative in DATA_FILES:
        payload[relative] = json.loads((ROOT / relative).read_text(encoding="utf-8"))
    output = "window.STRADDIE_TENDERS_DATA = "
    output += json.dumps(payload, ensure_ascii=False, indent=2)
    output += ";\n"
    (ROOT / "assets" / "data.js").write_text(output, encoding="utf-8")
    print("Built assets/data.js")


if __name__ == "__main__":
    main()
