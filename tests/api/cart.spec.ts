import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

interface Product {
  id: string;
  name: string;
  price: number;
  in_stock: boolean;
}

test.describe('Shopping Cart API Lifecycle', () => {
  test('should create a cart, add an in-stock product, and retrieve cart contents', async ({ request }) => {
    // 1. Dynamically discover an in-stock product (hermetic against DB resets)
    const productsRes = await request.get(`${API_BASE_URL}/products?page=1`);
    expect(productsRes.status()).toBe(200);
    const productsBody = await productsRes.json();
    const inStockProduct = (productsBody.data as Product[]).find((p) => p.in_stock);
    expect(inStockProduct).toBeDefined();

    // 2. Create a fresh cart
    const createCartRes = await request.post(`${API_BASE_URL}/carts`, {
      data: {},
    });
    expect(createCartRes.status()).toBe(201);
    const { id: cartId } = await createCartRes.json();
    expect(typeof cartId).toBe('string');

    // 3. Add quantity 2 of the product into the new cart
    const addItemRes = await request.post(`${API_BASE_URL}/carts/${cartId}`, {
      data: {
        product_id: inStockProduct!.id,
        quantity: 2,
      },
    });
    expect(addItemRes.status()).toBe(200);
    const addItemBody = await addItemRes.json();
    expect(addItemBody.result).toBe('item added or updated');

    // 4. Retrieve the cart and verify persisted item + quantity
    const getCartRes = await request.get(`${API_BASE_URL}/carts/${cartId}`);
    expect(getCartRes.status()).toBe(200);
    const cartBody = await getCartRes.json();
    expect(cartBody.id).toBe(cartId);
    expect(cartBody.cart_items).toHaveLength(1);
    expect(cartBody.cart_items[0].product_id).toBe(inStockProduct!.id);
    expect(cartBody.cart_items[0].quantity).toBe(2);
    expect(cartBody.cart_items[0].product.name).toBe(inStockProduct!.name);
  });
});
