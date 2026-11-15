import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

interface Product {
  id: string;
  name: string;
  price: number;
  in_stock: boolean;
}

test.describe('Catalog & Auth API', () => {
  test('should return paginated products with expected fields', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products?page=1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.current_page).toBe(1);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const firstProduct: Product = body.data[0];
    expect(typeof firstProduct.id).toBe('string');
    expect(typeof firstProduct.name).toBe('string');
    expect(typeof firstProduct.price).toBe('number');
    expect(typeof firstProduct.in_stock).toBe('boolean');
  });

  test('should filter products when searching by keyword', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products/search?q=Hammer`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    for (const item of body.data as Product[]) {
      expect(item.name.toLowerCase()).toContain('hammer');
    }
  });

  test('should return non-empty categories and brands lists', async ({ request }) => {
    const categoriesRes = await request.get(`${API_BASE_URL}/categories`);
    expect(categoriesRes.status()).toBe(200);
    const categories = await categoriesRes.json();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    const brandsRes = await request.get(`${API_BASE_URL}/brands`);
    expect(brandsRes.status()).toBe(200);
    const brands = await brandsRes.json();
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
  });

  test('should reject invalid login credentials with 401 Unauthorized', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: 'nonexistent.qa@example.com',
        password: 'invalid-password',
      },
    });
    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });
});
