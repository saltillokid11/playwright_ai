# Project Blueprint: Toolshop Playwright Framework

> **Purpose:** Single source of truth for reconstructing this test automation framework (UI Page Objects, REST API tests, and GitHub Actions CI) from scratch using AI agents.

---

## 1. System Under Test
- **Web App Base URL:** `https://practicesoftwaretesting.com`
- **REST API Base URL:** `https://api.practicesoftwaretesting.com`
- **Custom Test ID Attribute:** `data-test` (`testIdAttribute: 'data-test'` in `playwright.config.ts`)
- **Framework Stack:** Playwright Test + TypeScript (Node.js / CommonJS)

---

## 2. UI Architecture Blueprint (Page Objects & E2E Specs)
All Page Objects inherit from `pages/BasePage.ts` and enforce `AGENTS.md` locator rules:

| Page Object | Route / Scope | Key Locators & Behaviors |
| --- | --- | --- |
| `BasePage` | Shared layout | `brandLogo` (`heading: Practice Software Testing`), `cartLink` (`link: cart`), `cartQuantity` (`testId: cart-quantity`), `navigateTo(url)`, `openCart()` |
| `HomePage` | `/` | `searchInput` (placeholder `Search`), `searchButton` (`button: Search`), `productCards` (`.card`), `productTitles` (`.card-title`), `search(keyword)`, `openProduct(name)` |
| `ProductDetailPage` | `/product/:id` | `productName` (`heading` level 1), `quantityInput` (`testId: quantity`), `addToCartButton` (`button: Add to Cart`), `toastAlert` (`role: alert`), `setQuantity(qty)`, `addToCart()` |
| `CartPage` | `/checkout` | `productTitle` (`testId: product-title`), `quantityInput` (`testId: product-quantity`), `linePrice` (`testId: line-price`), `cartTotal` (`testId: cart-total`), `proceedToCheckoutButton` (`button: Proceed to checkout`) |

- **Custom POM Fixtures (`fixtures/testFixtures.ts`):** Injects pre-instantiated `homePage`, `productDetailPage`, and `cartPage` into tests via `test.extend<PageFixtures>()`.
- **Browser Cart State (`sessionStorage`):** Angular persists active cart state in `sessionStorage` keys `cart_id` and `cart_quantity`, enabling instant Hybrid API-to-UI cart seeding before navigating to `/checkout`.

---

## 3. Verified REST API Contract (`https://api.practicesoftwaretesting.com`)

### A. Catalog & Search
1. **`GET /products?page=1`**
   - **Status:** `200`
   - **Response Shape:** `{ current_page, data: Product[], from, last_page, per_page, to, total }`
   - **Product Fields:** `id` (string), `name` (string), `description` (string), `price` (number), `in_stock` (boolean), `is_rental` (boolean), `category` (object), `brand` (object)
   - **Sample Item:** `{ id: "01M7ENT3NXPRD23KR8R1E8ZJC5", name: "Combination Pliers", price: 14.15, in_stock: true }`
2. **`GET /products/search?q=Hammer`**
   - **Status:** `200`
   - **Response Shape:** `{ data: Product[], ... }` containing matching products (e.g., `"Hammer"`, `"Claw Hammer"`).
3. **`GET /categories`**
   - **Status:** `200`
   - **Response Shape:** `Array<{ id, name, slug, parent_id }>`
4. **`GET /brands`**
   - **Status:** `200`
   - **Response Shape:** `Array<{ id, name, slug }>`

### B. Shopping Cart Lifecycle
1. **`POST /carts`**
   - **Body:** `{}`
   - **Status:** `201`
   - **Response Shape:** `{ id: string }`
2. **`POST /carts/{cartId}`**
   - **Body:** `{ product_id: string, quantity: number }`
   - **Status:** `200`
   - **Response Shape:** `{ result: "item added or updated" }`
3. **`GET /carts/{cartId}`**
   - **Status:** `200`
   - **Response Shape:** `{ id, cart_items: Array<{ id, quantity, cart_id, product_id, product: { id, name, price, in_stock } }> }`

### C. Authentication (Negative Validation)
1. **`POST /users/login`**
   - **Body (invalid):** `{ email: string, password: string }`
   - **Status:** `401`
   - **Response Shape:** `{ error: "Unauthorized" }`

---

## 4. Target Test Coverage & CI Gates
- **UI E2E Tests (`tests/*.spec.ts`):** Home catalog & search, Product detail & add-to-cart, Shopping cart math & badge sync.
- **Hybrid API + UI Tests (`tests/hybrid-cart.spec.ts`):** Seed cart via REST API (`POST /carts` + `POST /carts/{id}`), inject `sessionStorage` state, and assert UI rendering on `/checkout` via custom fixtures.
- **API Tests (`tests/api/*.spec.ts`):** Catalog contract & search filtering, full Cart CRUD flow (`POST /carts` → `POST /carts/{id}` → `GET /carts/{id}`), negative login (`401`).
- **CI/CD Pipeline (`.github/workflows/playwright.yml`):** Triggers on push/PR to `main`/`master`, runs the Chromium test suite (`npx playwright test --project=chromium`), and uploads the `playwright-report/` artifact.
