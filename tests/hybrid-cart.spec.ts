import { test, expect } from '../fixtures/testFixtures';

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

interface Product {
  id: string;
  name: string;
  price: number;
  in_stock: boolean;
}

test.describe('Hybrid API + UI Cart Seeding', () => {
  test('should render API-seeded cart items and totals in CartPage without UI setup', async ({
    page,
    request,
    cartPage,
  }) => {
    // 1. Seed cart state quickly via REST API
    const productsRes = await request.get(`${API_BASE_URL}/products?page=1`);
    expect(productsRes.status()).toBe(200);
    const { data: products } = await productsRes.json();
    const product = (products as Product[]).find((p) => p.in_stock);
    expect(product).toBeDefined();

    const quantity = 3;
    const createCartRes = await request.post(`${API_BASE_URL}/carts`, { data: {} });
    expect(createCartRes.status()).toBe(201);
    const { id: cartId } = await createCartRes.json();

    const addItemRes = await request.post(`${API_BASE_URL}/carts/${cartId}`, {
      data: { product_id: product!.id, quantity },
    });
    expect(addItemRes.status()).toBe(200);

    // 2. Inject browser sessionStorage before page load and jump straight to /checkout
    await page.addInitScript(
      ({ id, qty }) => {
        window.sessionStorage.setItem('cart_id', id);
        window.sessionStorage.setItem('cart_quantity', String(qty));
      },
      { id: cartId, qty: quantity }
    );

    await cartPage.navigateTo('/checkout');
    await cartPage.verifyPageLoaded();

    // 3. Assert UI renders the exact API-seeded product and calculated total
    const expectedTotal = `$${(product!.price * quantity).toFixed(2)}`;
    await expect(cartPage.cartQuantity).toHaveText(String(quantity));
    await expect(cartPage.productTitle).toHaveText(product!.name);
    await expect(cartPage.quantityInput).toHaveValue(String(quantity));
    await expect(cartPage.linePrice).toHaveText(expectedTotal);
    await expect(cartPage.cartTotal).toHaveText(expectedTotal);
  });
});
