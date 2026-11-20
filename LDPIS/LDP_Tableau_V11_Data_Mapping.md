# LDP V11 dashboard: data binding contract

Source SQL: Tableau query.txt
Oracle service: 132.145.99.84:1521/ldpisprd
NOTE: The V11 .twb is a layout prototype and still uses the sample CSV. It is NOT connected to Oracle yet.

## Fixed display rows (do not derive row labels from SQL)
Vertical: Branded Products & Retail | Commercial & Exports | Construction and Solution | Engineering & Packaging - Tubes | Grand Total
Zone: API | EAST | NORTH | SOUTH | WEST | EXPORT | Grand Total

## Oracle query field mapping
Top left: B2D=BTD, B2P=BTP, Pending DO=PENDING_DO, Total Linked Stock=TOTAL_LNK_QTY
Vertical B2D/B2P:
Branded Products & Retail=BPRTUBE_BTD/BPRTUBE_BTP
Commercial & Exports=CETUBE_BTD/CETUBE_BTP
Construction and Solution=CSTUBE_BTD/CSTUBE_BTP
Engineering & Packaging - Tubes=EPTUBE_BTD/EPTUBE_BTP
Grand Total=BTD/BTP
Zone B2D/B2P:
API=API_BTD/API_BTP
EAST=EAST_BTD/EAST_BTP
NORTH=NORTH_BTD/NORTH_BTP
SOUTH=SOUTH_BTD/SOUTH_BTP
WEST=WEST_BTD/WEST_BTP
EXPORT=EXPORT_BTD/EXPORT_BTP
Grand Total=BTD/BTP
Top middle: Total Stock=TOTAL_STK; Total Linked Stock=TOTAL_LINK_STK; Total Unlinked Stock=TOTAL_UNLINK_STK; Hold Batch=TOTAL_HOLD; Hold Batch %=TOTAL_HOLD_PER.
Top right: Signoff Qty=EOP_SIGNOF_QTY; GRN compliance qty=GRNCOMP_QTY; GRN compliance %=GRNCOMP_PER; Rolling OSP=ROLLING_OSP; Rolling MTD=ROLLING_MTD; Rolling compliance %=ROLLCOMP_PER; Production OSP=PRODUCTION_OSP; Production MTD=PRODUCTION_MTD; Production compliance %=PRODUCTION_PER.

## Known limitations of source query
PENDING_DO, GRNCOMP_QTY, GRNCOMP_PER, ROLLING_OSP, ROLLING_MTD, ROLLCOMP_PER, PRODUCTION_OSP, PRODUCTION_MTD, PRODUCTION_PER are literal zero placeholders in the source SQL, not live business metrics.
The query does not provide per-vertical/per-zone breakdown for stock, signoff, GRN, rolling, production, and unlinked stock. Those tables require additional SQL or explicitly marked example data.
No database connection has been tested. Never present sample data as live Oracle data.
