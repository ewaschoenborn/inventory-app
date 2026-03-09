# Frontend

This document focuses only on the frontend part of the project. For backend or data model details, see the main README.

## Frontend Overview
- Translated the Guides landing page text and topic titles/descriptions to German.
- Updated intro copy and availability hint text to match the new language.
- Worked with the Guides list interaction flow (topic navigation and availability states) to ensure copy fit the UI.
- Kept the existing layout/structure; no component rework, just content changes.
- Small copy consistency improvements while reviewing the guide list text.

## How to run
- `npm run dev`
- `npm run build`
- `npm run preview`

## Where things are (code map)
- `src/App.tsx` (app shell)
- `src/AppRoutes.tsx` (routes)
- `src/features/` (feature screens)
- `src/components/` (shared UI components)
- `src/layout/` (layout shells)
- `src/store/` (Redux store/slices)
- `src/db/` (Dexie/IndexedDB + schemas + Excel utils)
- `src/styles/` (theme + styled-components)
- `public/` (static assets)

## State & data (only what exists)
- Redux Toolkit store in `src/store/store.ts` with `searchSlice` for query/sort/filter state.
- Dexie database in `src/db/db.ts` (items, packing plans, packing plan items).
- Data access helpers in `src/app/api.ts` and `src/app/packingPlanApi.ts` using Dexie + `dexie-react-hooks`.
- Excel import/export helpers in `src/db/utils/excel.ts`.

## Manual test checklist
- Inventory list: search, filter, sort, open item details.
- Add item: create new item, required fields, save and verify in list.
- Import/Export: export to Excel, import Excel file, confirm extend/overwrite.
- Packing plans: select items in Pack mode, set quantities, save and reopen plan.
- Guides: open guide list and a guide detail page.

## Notes / limitations
- Filtered searches load all items and filter in memory (see `inventoryApi.fetchItemsPaginatedWithFilter` in `src/app/api.ts`).
- Remote sync is mocked only (`src/app/_remoteApi.ts`).
- No frontend test script in `package.json` (only dev/build/preview, lint/format).
