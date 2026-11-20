# Tableau worksheet mapping — SQL source contract

This specification uses `Tableau query.txt` as source. **Do not use the CSV**. Configure Oracle Custom SQL manually in Tableau, then create the calculated fields described below. Do not commit credentials.

## Fixed row dimensions

Vertical rows (always exactly five): Branded Products & Retail; Commercial & Exports; Construction and Solution; Engineering & Packaging - Tubes; Grand Total.

Zone rows (always exactly seven): API; EAST; NORTH; SOUTH; WEST; EXPORT; Grand Total.

Unlinked stock vertical rows (five): API; BPRS; C&S; EXPORT; Grand Total.

The SQL is a **single aggregated record**, so the fixed labels must be produced using a separate static scaffold/parameter or Tableau calculated dimension and row-wise CASE expressions; merely dragging raw fields into rows cannot create the required table.

## Ten table specifications

1. Combined Order Table—Vertical: Vertical | B2D | B2P | Pending DO | Total Linked Stock. B2D mappings: BPRTUBE_BTD, CETUBE_BTD, CSTUBE_BTD, EPTUBE_BTD, BTD. B2P: BPRTUBE_BTP, CETUBE_BTP, CSTUBE_BTP, EPTUBE_BTP, BTP.
2. Combined Order Table—Zone: Zone | B2D | B2P | Pending DO. B2D: API_BTD, EAST_BTD, NORTH_BTD, SOUTH_BTD, WEST_BTD, EXPORT_BTD, BTD. B2P: API_BTP, EAST_BTP, NORTH_BTP, SOUTH_BTP, WEST_BTP, EXPORT_BTP, BTP.
3. Stock Table—Vertical: Vertical | Stock | High Age | Potential High Age | Grand Total. Source prefixes VERTICAL_BP, VERTICAL_CE, VERTICAL_CS, VERTICAL_EP, VERTICAL_TOTAL; suffixes 1T53, HIGHAGE, PHIGHAGE, GTOTAL.
4. Stock Table—Zone: Zone | Stock | High Age | Potential High Age | Grand Total. Source prefixes ZONE_API, ZONE_EAST, ZONE_NORTH, ZONE_SOUTH, ZONE_WEST, ZONE_EXPORT, ZONE_TOTAL; suffixes 1T53, HIGHAGE, PHIGHAGE, GTOTAL. Note ZONE_ETO exists but is not a required displayed zone; confirm whether it should replace or supplement another row.
5. Stock Table—Type: Stock Type | Stock Qty. Overall TOTAL_LINK_STK and TOTAL_UNLINK_STK.
6. Stock Table—Age: Age Bucket | Stock Qty. Source SQL does not provide individual 0–7 / 8–30 / 31–60 / 61–90 / 90+ bucket totals as named fields.
7. BOP Table—Vertical: Vertical | Signoff Qty | GRN Compliance | Signoff GRN | Non-signoff GRN | Gap. Source prefixes VERT_BPR, VERT_CE, VERT_CS, VERT_EP, VERT_TOTAL; suffixes SIGNOFF, GRC, SUMSIGNOFF, NONSIGNOFF, GAP.
8. BOP Table—Zone: Zone | Signoff Qty | GRN Compliance | Signoff GRN | Non-signoff GRN | Gap. Source prefixes ZONE_API, ZONE_EAST, ZONE_NORTH, ZONE_SOUTH, ZONE_WEST, ZONE_GTOTAL; suffixes SIGNOFF, GRC, SUMSIGNOFF, NONSIGNOFF, GAP. No ZONE_EXPORT_SIGNOFF fields are provided.
9. BOF Table—Vertical: Vertical | B2P / BOF | other measures per reference. BPRTUBE_BTP, CETUBE_BTP, CSTUBE_BTP, EPTUBE_BTP, BTP.
10. BOF Table—Zone: Zone | B2P / BOF | other measures per reference. API_BTP, EAST_BTP, NORTH_BTP, SOUTH_BTP, WEST_BTP, EXPORT_BTP, BTP.

## Top summary row

Left: BTD, BTP, PENDING_DO, TOTAL_LNK_QTY.
Middle: TOTAL_STK, TOTAL_LINK_STK, TOTAL_UNLINK_STK, TOTAL_HOLD, TOTAL_HOLD_PER.
Right: EOP_SIGNOF_QTY, GRNCOMP_QTY, GRNCOMP_PER, ROLLING_OSP, ROLLING_MTD, ROLLCOMP_PER, PRODUCTION_OSP, PRODUCTION_MTD, PRODUCTION_PER.

## Data quality

SQL includes many `0 FIELDNAME` placeholders. These will return zeros; they are not missing fields and must not be represented as real production values. The 10 tables cannot be represented accurately as fully live until the placeholders and absent age/export breakdowns are resolved. V12 is a layout-only prototype, not a completed connected workbook.
