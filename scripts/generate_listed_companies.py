from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import xml.etree.ElementTree as ET
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zipfile import ZipFile

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PATH = ROOT_DIR / "data" / "companies.generated.ts"
DEFAULT_CACHE_PATH = ROOT_DIR / "scripts" / ".cache" / "dart-company-cache.json"

MARKET_MAP = {
    "Y": "KOSPI",
    "K": "KOSDAQ",
    "N": "KONEX",
    "E": "OTHER",
}


def make_request(url: str) -> Request:
    return Request(
        url,
        headers={
            "User-Agent": "company-compatibility-generator/1.0",
            "Accept": "*/*",
        },
    )


def fetch_bytes(url: str) -> bytes:
    with urlopen(make_request(url), timeout=60) as response:
        return response.read()


def fetch_json(url: str) -> dict[str, Any]:
    return json.loads(fetch_bytes(url).decode("utf-8"))


def digits_only(value: str | None) -> str:
    return re.sub(r"\D", "", value or "")


def normalize_date(value: str | None) -> str:
    digits = digits_only(value)
    if len(digits) != 8:
        return ""
    return f"{digits[:4]}-{digits[4:6]}-{digits[6:8]}"


def map_industry(induty_code: str | None) -> str:
    digits = digits_only(induty_code)
    if len(digits) < 2:
        return "service"

    division = int(digits[:2])

    if division in {58, 62, 63}:
        return "tech"
    if division == 61:
        return "telecom"
    if division in {64, 65, 66}:
        return "finance"
    if division == 21:
        return "bio"
    if division in {5, 6, 7, 8, 35}:
        return "energy"
    if division in {41, 42}:
        return "construction"
    if division in {45, 46, 47}:
        return "retail"
    if division in {
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        22,
        23,
        24,
        25,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
    }:
        return "manufacturing"
    if division == 26:
        return "tech"

    return "service"


def load_cache(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def save_cache(path: Path, cache: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )


def fetch_corp_codes(api_key: str) -> list[dict[str, str]]:
    url = (
        "https://opendart.fss.or.kr/api/corpCode.xml?"
        + urlencode({"crtfc_key": api_key})
    )
    zipped = fetch_bytes(url)

    with ZipFile(BytesIO(zipped)) as zip_file:
        xml_name = next(
            (name for name in zip_file.namelist() if name.lower().endswith(".xml")),
            None,
        )
        if xml_name is None:
            raise RuntimeError("OpenDART corpCode response did not include an XML file.")

        xml_data = zip_file.read(xml_name)

    root = ET.fromstring(xml_data)
    companies: list[dict[str, str]] = []

    for item in root.findall("list"):
        stock_code = digits_only(item.findtext("stock_code"))
        corp_code = digits_only(item.findtext("corp_code"))
        corp_name = (item.findtext("corp_name") or "").strip()

        if len(stock_code) != 6 or not corp_code or not corp_name:
            continue

        companies.append(
            {
                "corp_code": corp_code,
                "corp_name": corp_name,
                "stock_code": stock_code,
            }
        )

    companies.sort(key=lambda company: company["stock_code"])
    return companies


def minimize_company_overview(payload: dict[str, Any]) -> dict[str, str]:
    return {
        "corp_name": str(payload.get("corp_name", "")).strip(),
        "stock_name": str(payload.get("stock_name", "")).strip(),
        "stock_code": digits_only(str(payload.get("stock_code", ""))),
        "corp_cls": str(payload.get("corp_cls", "")).strip(),
        "induty_code": digits_only(str(payload.get("induty_code", ""))),
        "est_dt": digits_only(str(payload.get("est_dt", ""))),
    }


def fetch_company_overview(api_key: str, corp_code: str, retries: int = 3) -> dict[str, str] | None:
    url = (
        "https://opendart.fss.or.kr/api/company.json?"
        + urlencode({"crtfc_key": api_key, "corp_code": corp_code})
    )

    for attempt in range(retries):
        try:
            payload = fetch_json(url)
        except (HTTPError, URLError, TimeoutError) as exc:
            if attempt == retries - 1:
                raise RuntimeError(f"Failed to fetch company overview for {corp_code}: {exc}") from exc
            time.sleep(1.5 * (attempt + 1))
            continue

        status = str(payload.get("status", ""))
        if status == "000":
            return minimize_company_overview(payload)
        if status == "013":
            return None

        if attempt == retries - 1:
            raise RuntimeError(
                f"OpenDART company.json failed for {corp_code}: "
                f"{status} {payload.get('message', '')}"
            )

        time.sleep(1.5 * (attempt + 1))

    return None


def build_companies(corp_codes: list[dict[str, str]], cache: dict[str, Any]) -> list[dict[str, Any]]:
    generated: list[dict[str, Any]] = []
    seen_stock_codes: set[str] = set()

    for corp in corp_codes:
        overview = cache.get(corp["corp_code"])
        if not overview or overview.get("_skip"):
            continue

        stock_code = overview.get("stock_code") or corp["stock_code"]
        founded_date = normalize_date(overview.get("est_dt"))

        if len(stock_code) != 6 or not founded_date:
            continue
        if stock_code in seen_stock_codes:
            continue

        seen_stock_codes.add(stock_code)

        company_name = (
            overview.get("stock_name")
            or overview.get("corp_name")
            or corp["corp_name"]
        ).strip()

        market = MARKET_MAP.get((overview.get("corp_cls") or "").strip(), "OTHER")

        generated.append(
            {
                "name_kr": company_name,
                "slug": f"stock-{stock_code}",
                "founded_date": founded_date,
                "industry": map_industry(overview.get("induty_code")),
                "stock_code": stock_code,
                "market": market,
            }
        )

    generated.sort(
        key=lambda company: (
            company["market"],
            company["name_kr"],
            company["stock_code"],
        )
    )

    for index, company in enumerate(generated, start=1):
        company["id"] = index

    return generated


def write_output(path: Path, companies: list[dict[str, Any]]) -> None:
    generated_at = datetime.now().isoformat(timespec="seconds")
    lines = [
        'import { Company } from "@/lib/types";',
        "",
        "// Auto-generated by scripts/generate_listed_companies.py",
        f"// Generated at: {generated_at}",
        f"// Company count: {len(companies)}",
        "export const generatedCompanies: Company[] = [",
    ]

    for company in companies:
        lines.append("  {")
        lines.append(f'    id: {company["id"]},')
        lines.append(
            f'    name_kr: {json.dumps(company["name_kr"], ensure_ascii=False)},'
        )
        lines.append(f'    slug: {json.dumps(company["slug"])},')
        lines.append(f'    founded_date: {json.dumps(company["founded_date"])},')
        lines.append(f'    industry: {json.dumps(company["industry"])},')
        lines.append(f'    stock_code: {json.dumps(company["stock_code"])},')
        lines.append(f'    market: {json.dumps(company["market"])},')
        lines.append("  },")

    lines.append("];")
    lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate the full listed-company dataset from OpenDART."
    )
    parser.add_argument(
        "--api-key",
        help="OpenDART API key. Falls back to the DART_API_KEY environment variable.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Only fetch the first N listed companies. Useful for quick testing.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.12,
        help="Delay in seconds between OpenDART company.json requests.",
    )
    parser.add_argument(
        "--force-refresh",
        action="store_true",
        help="Ignore the local cache and refetch everything.",
    )
    parser.add_argument(
        "--cache-path",
        default=str(DEFAULT_CACHE_PATH),
        help="Path to the local cache JSON file.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    api_key = args.api_key or os.environ.get("DART_API_KEY")

    if not api_key:
        print(
            "DART_API_KEY is required. Set it in your environment or pass --api-key.",
            file=sys.stderr,
        )
        return 1

    cache_path = Path(args.cache_path)
    cache: dict[str, Any] = {} if args.force_refresh else load_cache(cache_path)

    corp_codes = fetch_corp_codes(api_key)
    if args.limit > 0:
        corp_codes = corp_codes[: args.limit]

    total = len(corp_codes)
    print(f"Loaded {total} listed companies from OpenDART corpCode.xml")

    fetched_count = 0

    for index, corp in enumerate(corp_codes, start=1):
        corp_code = corp["corp_code"]

        if not args.force_refresh and corp_code in cache:
            continue

        overview = fetch_company_overview(api_key, corp_code)
        cache[corp_code] = overview if overview is not None else {"_skip": True}
        fetched_count += 1

        if fetched_count % 25 == 0:
            save_cache(cache_path, cache)

        if index % 100 == 0 or index == total:
            print(f"[{index}/{total}] processed")

        if args.delay > 0:
            time.sleep(args.delay)

    save_cache(cache_path, cache)

    companies = build_companies(corp_codes, cache)
    write_output(OUTPUT_PATH, companies)

    print(f"Generated {len(companies)} companies -> {OUTPUT_PATH}")
    if args.limit > 0:
        print("Note: --limit was used, so the generated dataset is partial.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
