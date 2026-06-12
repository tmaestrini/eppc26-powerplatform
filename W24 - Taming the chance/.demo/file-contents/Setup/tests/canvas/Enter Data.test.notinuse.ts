import { test, expect } from '../../fixtures/canvasapp.fixtures';

test.describe("Canvas App Enter Data (Fixtures)", () => {

  test('Check Search & Find function', async ({ canvasApp, page }) => {
    const firstRecordText = "Anderson, Isabella";

    const searchBox = canvasApp.getInputField("txtHomeMainMenueContactListSearch");
    await searchBox.waitFor({ state: 'visible' });

    // Verify first record in component
    const firstRecord = canvasApp.getLabel("txtKontaktData").first();
    await expect(firstRecord).toHaveText(firstRecordText);

    // Search for 'Test' - first record should not be visible
    await searchBox.fill('Test');
    await expect(firstRecord).not.toBeVisible();

    // Search for 'Anderson' - first record should be visible again
    await searchBox.fill('Anderson');
    await expect(firstRecord).toBeVisible();

    // Clear search - first record should still be visible
    await searchBox.fill('');
    await expect(firstRecord).toBeVisible();
  });

  test('Check Dropdown (Inaktive Kontakte)', async ({ canvasApp }) => {
    const dropdown = canvasApp.getDropdown("cmbHomeMainMenueContactListPersonalContacts");
    await expect(dropdown).toBeVisible();

    // getDropdownOption opens the dropdown and returns the matching option locator
    const option = await canvasApp.getDropdownOption("cmbHomeMainMenueContactListPersonalContacts", "Inaktive Kontakte");
    await expect(option).toBeVisible();
    await option.click();
  });

  test('Check Button (Neuer Kontakt)', async ({ canvasApp }) => {
    const toolbarButton = canvasApp.getToolbarButton("new");
    await expect(toolbarButton).toBeVisible();
    await canvasApp.clickButton(toolbarButton);

    const inputField = canvasApp.getInputField("DataCardValue5");
    await inputField.waitFor({ state: 'visible' });
    await inputField.fill("Test Contact");

    const inputField2 = canvasApp.getInputField("DataCardValue4");
    await inputField2.waitFor({ state: 'visible' });
    await inputField2.focus();

    const saveButton = canvasApp.getButton("btnCreateContact");
    await expect(saveButton).toBeVisible();
  });
});
