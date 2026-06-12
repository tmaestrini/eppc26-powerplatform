import { test, expect } from '../../fixtures/canvas.fixtures';

test.describe("Canvas App UI Elements (Fixtures)", () => {

  test('Check English UI Elements', async ({ canvasApp }) => {
    const englishText = 'Welcome';

    await canvasApp.getLabel("lblMainTitle");
    await expect(canvasApp.getLabel("lblMainTitle")).toContainText(englishText);
    
    await canvasApp.clickControl({ name: "btnLangSelectorEn" });
    await expect(canvasApp.getControl({ name: "lblMainTitle" })).toContainText(englishText);
  });

  test('Check German UI Elements', async ({ canvasApp }) => {
    await canvasApp.clickControl({ name: "btnLangSelectorDe" });

    await expect(canvasApp.getLabel("lblMainTitle")).toContainText('Willkommen');
    await expect(canvasApp.getButton("btnButtonCanvas2")).toContainText('Neuer Button');
  });

  test('Check Italian UI Elements', async ({ canvasApp }) => {
    await canvasApp.clickControl({ name: "btnLangSelectorIt" });

    await expect(canvasApp.getLabel("lblMainTitle")).toContainText('Benvenuti');
    await expect(canvasApp.getButton("btnButtonCanvas2")).toContainText('Bottone nuovo');
  });
});
