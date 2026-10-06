# LD01S009 - External WIP linking/Delinking

Objective

- Implement a feature equivalent to LD01S007 (WIP Linking/De-Linking) for External WIP, named LD01S009. Provide both backend and frontend components and register routes.

Scope

- Backend: repository, model, controller, route, register in app.ts, typed additions if required.
- Frontend: React view (`LD01S009.jsx`) copied/adapted from `LD01S007.jsx`, update API URLs to `/api/LD01S009/*`, add route entry in `routes.js`.
- QA: basic manual test cases and smoke checks.

Implementation details

1. Backend

   - Create `src/repository/LD01S009Query.ts` by copying `LD01S007Query.ts`. Keep SQL and logic identical unless External-specific status mappings are required later.
   - Create `src/models/LD01S009Model.ts` that wraps repository functions (getList, getMatNoList, getWipOrders).
   - Create `src/controllers/LD01S009Controller.ts` with endpoints: getList, getMatNoList, getWipOrders. Mimic `LD01S007Controller.ts` behavior including multi-row update handling.
   - Create `src/routes/LD01S009Route.ts` and secure endpoints with authentication middleware.
   - Register the route in `src/app.ts` as `/api/LD01S009/`.

2. Frontend

   - Create `src/views/Planning/LD01S009.jsx` by copying `LD01S007.jsx` and change:
     - Component and exported function name to `LD01S009`.
     - Replace all API URLs `api/LD01S007/*` with `api/LD01S009/*`.
     - Set internal pageName to `LD01S009` for authorization lookup.
   - Add import and menu entry in `src/routes.js` to expose the page under Planning -> Scheduling as "External WIP Linking/De-Linking" with route `/LD01S009`.

3. Tests and QA
   - Add basic backend tests (integration) for endpoints under `test/` (out of scope for this first pass).
   - QA checklist: linking single/multiple coils, delinking, invalid inputs, auth/permission checks, concurrency.

Rollout

- Add feature without toggles; coordinate frontend and backend deploys together.
- Run smoke tests after deploy.

Notes

- The initial implementation mirrors LD01S007 exactly. If External WIP requires different status codes or SQL, we'll adjust repository SQL after stakeholder confirmation.
