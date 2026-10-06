# LD12S001 Changes Plan

## 1. Compare `getFillData` Implementation with `LD08S001`

- Review the `getFillData` function in `LD08S001Query.ts` and compare it with `LD12S001Query.ts`.

## 2. Update Controller to Match Parameters and Conditions

- Modify `LD12S001Controller.ts` to ensure that the parameters match those in `LD08S001`.
- Ensure that the status condition is included in the main SQL query.

## 3. Update Model to Reflect Changes in Query Method

- Update the model in `LD12S001Model.ts` to reflect the changes made in the query method.

## 4. Modify SQL in Query File

- Update the SQL query in `LD12S001Query.ts` to remove conditions for RM_BATCH from the main query and handle them in an else clause.

## 5. Repeat for Other Modules

- Repeat the above steps for `LD13S001`.
