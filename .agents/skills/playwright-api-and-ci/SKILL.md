---
name: playwright-api-and-ci
description: >-
  Playbook for scaffolding Playwright REST API tests (APIRequestContext) and
  GitHub Actions CI/CD workflows grounded in docs/project-blueprint.md.
---

# Playwright API & GitHub Actions Skill

Use this playbook when generating or regenerating REST API tests (`tests/api/*.spec.ts`) or CI/CD pipelines (`.github/workflows/playwright.yml`).

---

## 1. Grounding Step (Mandatory)
Before generating code:
1. Read `docs/project-blueprint.md` for verified base URLs, endpoints, request payloads, and expected status codes.
2. Read `AGENTS.md` and `.agents/rules/api-and-ci-standards.md` for coding standards.

---

## 2. Standard API Test Pattern (`tests/api/<resource>.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

test.describe('<Resource> API', () => {
  test('should <expected behavior>', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products?page=1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });
});
```

### Hybrid API + UI Pattern
When UI setup is slow (e.g., building a cart or authenticating):
1. Seed state via `request.post(...)` in milliseconds.
2. Open the UI or inject state/cookies, then assert the UI outcome via Page Objects.

---

## 3. Standard GitHub Actions Workflow (`.github/workflows/playwright.yml`)

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium
      - name: Run Playwright tests (Chromium)
        run: npx playwright test --project=chromium
      - name: Upload Playwright HTML Report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## 4. Verification Checklist
1. Run API tests: `npx playwright test tests/api --project=chromium`
2. Run full Chromium suite: `npx playwright test --project=chromium`
*(If `typescript` is added to `devDependencies`, also run `npx tsc --noEmit`.)*
