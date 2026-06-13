import { test, expect } from '../../fixtures/canvas.fixtures';

/**
 * Test plan — Multi Language App (Canvas)
 *
 * App: https://apps.powerapps.com/play/e/<POWER_APPS_ENVIRONMENT_ID>/a/<CANVAS_APP_ID>
 *
 * Explored UI (single screen: scnDemo)
 * ─────────────────────────────────────
 * Header  (cntDemoHeader)
 *   btnLangSelectorDe  🇩🇪  — switch to German
 *   btnLangSelectorIt  🇮🇹  — switch to Italian
 *   btnLangSelectorEn  🇺🇸  — switch to English
 *
 * Left nav  (cntDemoMainNavi)
 *   btnButtonCanvas2   — navigation button (label also translates)
 *
 * Main content  (cntDemoMainContent)
 *   lblMainTitle           — welcome heading, translates per language
 *   lblMainText            — body copy,      translates per language
 *   lblMainMissingReference — deliberate missing-translation demo (always shows fallback)
 *   lblDescription         — footer note,   translates per language
 *
 * Startup behaviour: app detects browser language and sets it as default.
 * Fallback when no match: English.
 */

test.describe('Multi Language App', () => {

  // ─── TC-01  App loads and all UI elements are visible ───────────────────
  test('TC-01 app loads and all UI elements are visible', async ({ canvasApp }) => {
    // Language selector buttons
    await expect(canvasApp.getButton('btnLangSelectorDe')).toBeVisible();
    await expect(canvasApp.getButton('btnLangSelectorIt')).toBeVisible();
    await expect(canvasApp.getButton('btnLangSelectorEn')).toBeVisible();

    // Navigation button
    await expect(canvasApp.getButton('btnButtonCanvas2')).toBeVisible();

    // Main content labels
    await expect(canvasApp.getLabel('lblMainTitle')).toBeVisible();
    await expect(canvasApp.getLabel('lblMainText')).toBeVisible();
    await expect(canvasApp.getLabel('lblMainMissingReference')).toBeVisible();
    await expect(canvasApp.getLabel('lblDescription')).toBeVisible();
  });

  // ─── TC-02  Switch to English ────────────────────────────────────────────
  test('TC-02 switching to English localises all labels', async ({ canvasApp }) => {
    await canvasApp.getButton('btnLangSelectorEn').click({ force: true });

    await expect(canvasApp.getLabel('lblMainTitle')).toHaveText('Welcome!');
    await expect(canvasApp.getLabel('lblMainText')).toContainText('multiple languages');
    await expect(canvasApp.getLabel('lblDescription')).toContainText('translation records');
    await expect(canvasApp.getButton('btnButtonCanvas2')).toContainText('New button');
  });

  // ─── TC-03  Switch to German ─────────────────────────────────────────────
  test('TC-03 switching to German localises all labels', async ({ canvasApp }) => {
    await canvasApp.getButton('btnLangSelectorDe').click({ force: true });

    await expect(canvasApp.getLabel('lblMainTitle')).toHaveText('Willkommen!');
    await expect(canvasApp.getLabel('lblMainText')).toContainText('Mehrsprachigkeit');
    await expect(canvasApp.getLabel('lblDescription')).toContainText('Übersetzungen');
    await expect(canvasApp.getButton('btnButtonCanvas2')).toContainText('Neuer Button');
  });

  // ─── TC-04  Switch to Italian ────────────────────────────────────────────
  test('TC-04 switching to Italian localises all labels', async ({ canvasApp }) => {
    await canvasApp.getButton('btnLangSelectorIt').click({ force: true });

    await expect(canvasApp.getLabel('lblMainTitle')).toHaveText('Benvenuti!');
    await expect(canvasApp.getLabel('lblMainText')).toContainText('multilingue');
    await expect(canvasApp.getLabel('lblDescription')).toContainText('traduzioni');
    await expect(canvasApp.getButton('btnButtonCanvas2')).toContainText('Bottone nuovo');
  });

  // ─── TC-05  Round-trip language cycling ──────────────────────────────────
  test('TC-05 cycling through all three languages returns correct titles each time', async ({ canvasApp }) => {
    await canvasApp.getButton('btnLangSelectorEn').click({ force: true });
    await expect(canvasApp.getLabel('lblMainTitle')).toHaveText('Welcome!');

    await canvasApp.getButton('btnLangSelectorIt').click({ force: true });
    await expect(canvasApp.getLabel('lblMainTitle')).toHaveText('Benvenuti!');

    await canvasApp.getButton('btnLangSelectorDe').click({ force: true });
    await expect(canvasApp.getLabel('lblMainTitle')).toHaveText('Willkommen!');

    await canvasApp.getButton('btnLangSelectorEn').click({ force: true });
    await expect(canvasApp.getLabel('lblMainTitle')).toHaveText('Welcome!');
  });

  // ─── TC-06  Missing-translation fallback is language-independent ─────────
  test('TC-06 missing-translation label shows fallback message in every language', async ({ canvasApp }) => {
    const missingLabel = canvasApp.getLabel('lblMainMissingReference');
    const fallbackFragment = 'lblMainMissingReference';

    for (const btn of ['btnLangSelectorEn', 'btnLangSelectorDe', 'btnLangSelectorIt']) {
      await canvasApp.getButton(btn).click({ force: true });
      await expect(missingLabel).toContainText(fallbackFragment);
    }
  });

  // ─── TC-07  Navigation button is clickable and keeps screen intact ───────
  test('TC-07 nav button click keeps main screen visible', async ({ canvasApp }) => {
    await canvasApp.getButton('btnButtonCanvas2').click({ force: true });

    // Main content area must still be present after the click
    await expect(canvasApp.getLabel('lblMainTitle')).toBeVisible();
    await expect(canvasApp.getButton('btnLangSelectorEn')).toBeVisible();
  });

  // ─── TC-08  Nav button label translates with the active language ─────────
  test('TC-08 nav button label reflects the active language', async ({ canvasApp }) => {
    await canvasApp.getButton('btnLangSelectorDe').click({ force: true });
    await expect(canvasApp.getButton('btnButtonCanvas2')).toContainText('Neuer Button');

    await canvasApp.getButton('btnLangSelectorEn').click({ force: true });
    await expect(canvasApp.getButton('btnButtonCanvas2')).toContainText('New button');

    await canvasApp.getButton('btnLangSelectorIt').click({ force: true });
    await expect(canvasApp.getButton('btnButtonCanvas2')).toContainText('Bottone nuovo');
  });
});
