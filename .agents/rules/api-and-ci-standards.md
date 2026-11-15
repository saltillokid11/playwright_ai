# API Testing & CI/CD Standards

## 1. Playwright API Testing Policy
- **Native `request` Fixture Only:** Use Playwright's built-in `request` fixture (`APIRequestContext`) for all HTTP/REST tests. Never install third-party HTTP clients (`axios`, `node-fetch`, `supertest`).
- **Status Assertion First:** Always assert the HTTP status code (`expect(response.status()).toBe(200)` or `expect(response).toBeOK()`) *before* parsing `await response.json()`.
- **Dynamic Test Data (Hermeticity):** API tests that create or mutate state (such as carts) must dynamically capture resource IDs returned from `POST` calls rather than hardcoding stale IDs.
- **No Secrets in Code:** Credentials, tokens, and environment-specific keys must read from `process.env.*` (GitHub Secrets / `.env`), never hardcoded in specs.

---

## 2. GitHub Actions CI/CD Policy
- **Deterministic Installs:** Always use `npm ci` (clean install from `package-lock.json`), never `npm install`.
- **Fast Browser Setup:** Install only the browser(s) executed in the workflow (`npx playwright install --with-deps chromium`) to keep CI runner time fast.
- **Artifact Retention:** Always upload `playwright-report/` when a job finishes (`if: ${{ !cancelled() }}`) with a short retention window (`retention-days: 7`) so failures can be inspected in the Playwright Trace Viewer / HTML Report.
- **Verification Gate Before Merge:** CI workflows must run on both `push` and `pull_request` to `main` (or `master`), executing Playwright's test suite (and `npx tsc --noEmit` if `typescript` is installed in `devDependencies`).
