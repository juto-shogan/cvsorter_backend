# Project Review: Areas That Are Not Complete Yet

This document summarizes the major gaps found during a quick implementation review.

## 1) Backend cannot start (critical blocker)

- `backend/server/routes/miscRoutes.js` imports `../models/CV.js`, but the actual model file is `backend/server/models/cv.js` (lowercase), causing startup failure in ESM/case-sensitive environments.
- `backend/server/app.js` mounts `miscRoutes`, so this import issue blocks server boot.

## 2) CV upload flow has incomplete/incorrect persistence logic

- In `cvController.uploadCV`, the analyzer returns `totalScore`, but the controller saves `analysisResult.score`, so parsed scoring is not persisted correctly.
- Error cleanup uses `fs.existsSync` while `fs` is imported from `fs/promises`; `existsSync` is not available from that module.

## 3) Route surface is incomplete for expected dashboard actions

- `backend/server/routes/cvs.js` currently exposes only `GET /` and `POST /upload`.
- Controller methods for status update, delete, and download exist, but routes are not wired in this file.

## 4) Analytics stats naming mismatch with frontend expectations

- Dashboard stats in `CVContext` expect `approved`.
- CV statuses and update validation include `pending/reviewed/shortlisted/rejected` in backend controller logic.
- CV schema enum includes `pending/reviewed/approved/rejected`.

The mixed use of `approved` and `shortlisted` means analytics and UI status handling are not fully aligned.

## 5) Frontend data-layer integration is incomplete

- In `CVContext`, axios calls treat `api.get(...)` and `api.put(...)` as if they return raw payloads directly, but axios returns a response object by default.
- `updateCV`/`deleteCV` state updates key on `cv.id`, while MongoDB documents from backend typically use `_id` unless transformed.

## 6) Type contract mismatch (frontend vs backend)

- Frontend `CV` type restricts status to `'reviewed' | 'approved' | 'rejected'`, but backend also uses `'pending'` in schema/default and controller validation.
- Frontend `experience` is typed as `number`, but analyzer currently can emit string values like `"N/A"` or `"3 years of experience"`.

## 7) Placeholder / not-yet-robust CV analysis

- `cvAnalyzer` contains comments indicating extraction/scoring are basic placeholders and need more robust NLP/regex coverage.
- Several fields are defaulted to placeholders (`Unknown Candidate`, `N/A`, `Not Specified`) instead of reliable extraction.

## 8) Repository hygiene / production readiness gaps

- `backend/uploads/` includes many uploaded CV binaries committed in repo.
- No automated test suite scripts are provided in backend `package.json`; frontend has lint/build scripts but no tests.

