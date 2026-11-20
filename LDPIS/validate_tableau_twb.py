#!/usr/bin/env python3
"""Static Tableau TWB integrity checks; NOT a Tableau Desktop compatibility guarantee."""
import sys
from pathlib import Path
from lxml import etree

EXPECTED = [
    "Combined Order Table-Vertical", "Combined Order Table-Zone",
    "Stock Table - Vertical", "Stock Table - Zone",
    "Stock Table - Type", "Stock Table - Age",
    "BOP Table - Vertical", "BOP Table - Zone",
    "BOF Table - Vertical", "BOF Table - Zone",
]

def validate(path):
    errors = []
    try:
        root = etree.parse(str(path)).getroot()
    except etree.XMLSyntaxError as exc:
        return [f"XML syntax: {exc}"]
    if root.tag != "workbook":
        errors.append("Root must be workbook")
    sheets = {w.get("name") for w in root.findall("./worksheets/worksheet")}
    datasources = {d.get("name") for d in root.findall("./datasources/datasource")}
    dashboards = root.findall("./dashboards/dashboard")
    if not dashboards:
        errors.append("No dashboard")
    for dashboard in dashboards:
        names = [z.get("name") for z in dashboard.findall(".//zones/zone") if z.get("name")]
        for name in names:
            if name not in sheets:
                errors.append(f"Dashboard references missing worksheet: {name}")
        if "Three Section" in (dashboard.get("name") or ""):
            for name in EXPECTED:
                if names.count(name) != 1:
                    errors.append(f"Expected exactly one dashboard zone for {name}: {names.count(name)}")
    for w in root.findall("./worksheets/worksheet"):
        for d in w.findall(".//datasource-dependencies"):
            if d.get("datasource") not in datasources:
                errors.append(f"{w.get('name')}: missing datasource {d.get('datasource')}")
    for c in root.findall(".//relation"):
        if c.get("connection") and not root.xpath(".//named-connection[@name=$n]", n=c.get("connection")):
            errors.append(f"Unknown named connection: {c.get('connection')}")
    return errors

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python validate_tableau_twb.py workbook.twb [workbook2.twb]")
    failed = False
    for file in sys.argv[1:]:
        errors = validate(Path(file))
        print(f"{file}: {'FAIL' if errors else 'STATIC CHECKS PASS'}")
        for error in errors:
            print(" -", error)
        failed |= bool(errors)
    sys.exit(1 if failed else 0)
