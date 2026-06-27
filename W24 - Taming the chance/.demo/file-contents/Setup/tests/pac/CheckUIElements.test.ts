import { test, expect } from '../../fixtures/codeapp.fixtures';

test.describe("Code App UI Elements", () => {

  test('Check app Title', async ({ codeApp }) => {
    const desiredText = 'Welcome to your first Code App';

    // Code App content is rendered inside an iframe within <main>,
    const headerText = codeApp.app.locator('h1').first();
    await expect(headerText).toContainText(desiredText);
  });

  test('Check user context', async ({ codeApp }) => {
    const desiredText = "Welcome Adele Vance" 

    await codeApp.getButton('load-user-info').click();
    const headerText = codeApp.app.locator('h1').first();
    await expect(headerText).toContainText(desiredText);
  });
})