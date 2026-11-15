---
name: playwright-qa-engineer
description: >-
  Expert Playwright & TypeScript test automation engineer for authoring end-to-end tests,
  Page Object Models (POM), custom fixtures, and API tests following repo guidelines.
---

# Playwright QA Engineer Skill

This skill defines the standardized workflow and scaffolding conventions for generating tests and Page Object Models in this repository.

---

## 1. Directory Structure Conventions

Always maintain the following directory layout:

```text
playw_test_js/
├── AGENTS.md                  # Core rules and locator standards
├── playwright.config.ts       # Global test runner config
├── tsconfig.json              # TypeScript compilation settings
├── pages/                     # Page Object Model classes
│   ├── BasePage.ts            # Common layout elements (header, footer, nav)
│   ├── HomePage.ts            # Landing page & product catalog
│   └── ...                    # Domain-specific pages
├── fixtures/                  # Custom Playwright fixtures (Module 5)
│   └── testFixtures.ts        # POM dependency injection
└── tests/                     # Declarative test specifications
    ├── e2e/                   # End-to-end user journeys
    └── api/                   # Direct API validation
```

---

## 2. Standard Page Object Pattern

When creating a new Page Object in `pages/<PageName>.ts`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExamplePage extends BasePage {
  // 1. Declare locators as readonly properties
  readonly searchInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    // 2. Initialize using user-facing role / label locators
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.submitButton = page.getByRole('button', { name: 'Search' });
  }

  // 3. Define action methods representing user behaviors
  async searchForProduct(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.submitButton.click();
  }
}
```

---

## 3. Standard Test Specification Pattern

When authoring a test in `tests/<feature>.spec.ts`:

- Use `test.describe()` to group user scenarios.
- Keep tests declarative—hide selector manipulation inside page objects.
- Use web-first assertions for verification.

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Product Search & Filtering', () => {
  test('should display matching items when searching by keyword', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.searchForProduct('Hammer');

    await expect(homePage.productTitles).toContainText(['Claw Hammer']);
  });
});
```

---

## 4. Verification Workflow

After writing or modifying tests and page objects:
1. Run targeted test: `npx playwright test tests/<spec-file>`
2. Inspect trace on failure: `npx playwright show-report`
3. Verify TypeScript types: `npx tsc --noEmit`
