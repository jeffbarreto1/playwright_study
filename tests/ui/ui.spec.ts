import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('Login success', async ({ page }) => {
  
  // Valida se container de login foi carregadp
  await page.waitForSelector('[data-test="login-container"]');
  // Preenche credenciais validas e clica em submit
  await page.fill('[data-test="username"]','standard_user');
  await page.fill('[data-test="password"]','secret_sauce');
  await page.click('input[type="submit"]');
  //valida se acessou a área logada
  await page.waitForSelector('[data-test="header-container"]');

});

test('Login error', async ({ page }) => {
  
  await page.waitForSelector('[data-test="login-container"]');
  await page.fill('[data-test="username"]','standard_user');
  await page.fill('[data-test="password"]','321412');
  await page.click('input[type="submit"]');

  await page.waitForSelector('[data-test="error"]');
  await expect(page.locator('.error-message-container.error')).toContainText('Epic sadface: Username and password do not match any user in this service');

});

test('cart store', async ({ page }) => {
  // login
  await page.waitForSelector('[data-test="login-container"]');
  await page.fill('[data-test="username"]','standard_user');
  await page.fill('[data-test="password"]','secret_sauce');
  await page.click('input[type="submit"]');

  // Verifica se o container de produtos está disponível
  await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
  
  // Adicionando produtos ao carrinho

  const productsAdd = [
    'backpack',
    'bike-light',
    'fleece-jacket'
  ];

  for (const product of productsAdd){
    await expect(page.locator(`[data-test="add-to-cart-sauce-labs-${product}"]`)).toBeVisible();
    await page.click(`[data-test="add-to-cart-sauce-labs-${product}"]`);
    await expect(page.locator(`[data-test="remove-sauce-labs-${product}"]`)).toBeVisible();
  };
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('3');

  // Removendo produtos do carrinho
  const productsRemove = [
    'bike-light',
    'fleece-jacket'
  ];

  for (const product of productsRemove){
    await expect(page.locator(`[data-test="remove-sauce-labs-${product}"]`)).toBeVisible();
    await page.click(`[data-test="remove-sauce-labs-${product}"]`);
    await expect(page.locator(`[data-test="add-to-cart-sauce-labs-${product}"]`)).toBeVisible();
  };
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');

  // Validar produto restante no carrinho
  await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  await page.click('[data-test="shopping-cart-link"]');
  await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
  await expect(page.locator('[data-test="inventory-item-desc"]')).toContainText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
  await expect(page.locator('[data-test="inventory-item-price"]')).toContainText('$29.99');

  // Finalizar compra com erro
  await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  await page.click('[data-test="checkout"]');
  await expect(page.locator('.checkout_info')).toBeVisible();
  await expect(page.locator('[data-test="continue"]')).toBeVisible();
  // Clica em continuar sem preencher nenhum campo
  await page.click('[data-test="continue"]');
  // Valida se deu erro ao tentar continuar
  await page.waitForSelector('[data-test="error"]');
  await expect(page.locator('.error-message-container.error')).toContainText('Error: First Name is required');
  // Preenche o primeiro nome e valida
  await page.fill('[data-test="firstName"]','Jefferson');
  await page.click('[data-test="continue"]');
  await page.waitForSelector('[data-test="error"]');
  await expect(page.locator('.error-message-container.error')).toContainText('Error: Last Name is required');
  // Preenche o sobrenome e valida
  await page.fill('[data-test="lastName"]','Santos');
  await page.click('[data-test="continue"]');
  await page.waitForSelector('[data-test="error"]');
  await expect(page.locator('.error-message-container.error')).toContainText('Error: Postal Code is required');


});
