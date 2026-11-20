# V14 correction notes

Based on V13 Oracle ten-table workbook and the supplied query. V14 removes the extra ETO row from fixed Zone scaffolds, retaining API, EAST, NORTH, SOUTH, WEST, EXPORT. The supplied SQL does not contain live values for many measures: zero placeholders remain zero and are not fabricated. Tableau Oracle connection and SQL execution are not tested. This is a development candidate, not a production-validated dashboard.

The workbook still needs final validation in Tableau Desktop 2022.4, including testing its SQL and visual layout. Grand Total rows and exact screenshot matching have not been implemented in this revision.
