# Playwright Test Automation Standards & Agent Guidelines

## 1. Project Context
- **Framework:** Playwright Test with TypeScript
- **Target Application:** [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com)
- **Architecture Pattern:** Page Object Model (POM) with Custom Fixtures

---

## 2. Locators Policy (Strict Priority)
Always mimic how a real user perceives and navigates the interface. Locate elements using the following hierarchy:

1. **`page.getByRole(role, { name })`**: Highest priority. Accessible, resilient to DOM structure changes (e.g. `getByRole('button', { name: 'Add to cart' })`).
2. **`page.getByLabel(text)`**: For form inputs with associated `<label>` tags.
3. **`page.getByPlaceholder(text)`**: For inputs lacking explicit labels.
4. **`page.getByText(text, { exact: true })`**: For non-interactive text elements.
5. **`page.getByTestId(id)`**: For resilient matching when user-facing attributes are absent.

### 🚫 Strictly Forbidden Locators
- **No brittle CSS chains:** Avoid classes tied to styling like `div.col-md-6 > button.btn.btn-primary.btn-block`.
- **No XPath selectors:** Avoid `//div[@id='root']/div[2]/ul/li[1]/a`.
- **No manual indices without scoping:** Prefer narrowing container locators over `.nth(x)` whenever possible.

---

## 3. Assertions & Auto-Waiting Policy
Playwright tests must be deterministic and immune to race conditions.

### ✅ Mandatory Web-First Assertions
Always use async web-first assertions that auto-wait and poll the DOM:
```typescript
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Expected Text');
await expect(locator).toBeEnabled();
await expect(page).toHaveURL(/.*checkout/);
```

### 🚫 Forbidden Assertion Anti-Patterns
- Never evaluate locator state synchronously:
  ```typescript
  // ❌ WRONG: Fails immediately if DOM hasn't rendered yet
  expect(await locator.isVisible()).toBe(true);
  ```
- Never use arbitrary sleeps:
  ```typescript
  // ❌ WRONG: Flaky and slows down test suites
  await page.waitForTimeout(5000);
  ```
  Instead, wait on an expected locator state, URL change, or network response:
  ```typescript
  // ✅ RIGHT: Waits specifically for the required event
  await page.waitForResponse(resp => resp.url().includes('/products') && resp.status() === 200);
  ```

---

## 4. Test Isolation & Hermeticity
- **Independent Execution:** Every test (`test()`) must be self-contained and executable in complete isolation or in any arbitrary order.
- **No Shared Mutable State:** Tests must not rely on database state or cookies left behind by a previous test.
- **Parallel Safety:** Tests must run safely with `fullyParallel: true` across multiple worker processes.

---

## 5. Architectural Standards (Page Object Model)
- Tests (`tests/**/*.spec.ts`) should read declaratively like user stories or business acceptance criteria.
- Low-level selectors and Playwright API actions (`page.locator`, `click()`, `fill()`) must be encapsulated within Page Object classes (`pages/**/*.ts`).
- Page methods should return next-step Page Objects or primitive domain data where appropriate to enable fluent method chaining.
