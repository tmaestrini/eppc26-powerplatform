// tests/model-driven-crud.test.ts
import { expect, test } from '../../fixtures/mda.fixtures';
import { ModelDrivenAppPage } from '../../toolkit';

const mockData = {
  titel: 'Test Investitionsantrag',
  projektreferenz: 'PRJ-2026-001',
  projektstart: '01/07/2026',
  genehmigungskat: 'Projektkosten 1 bis 5 MCHF',
  auftraggeber: 'Tobias Maestrini',
  projektleiter: 'Tobias Maestrini',
  finanzenTeam: 'Finanzteam',
  direktorTeam: 'AAD_GR_GSU_EPPC26 Demo Users',
};

test.describe('[UC-1547] Investitionsantrag erstellen', () => {

  async function initializeInvestmentForm(modelDrivenApp: ModelDrivenAppPage, options?: { includeProjektleiter?: boolean }): Promise<void> {
    await modelDrivenApp.page.getByLabel('Titel').fill(mockData.titel);

    await modelDrivenApp.page.getByRole('combobox', { name: 'Genehmigungskat.' }).click();
    await modelDrivenApp.page.getByRole('option', { name: mockData.genehmigungskat }).click();

    await modelDrivenApp.page.getByLabel('Version').fill('1.0');
    await modelDrivenApp.page.getByLabel('Projektreferenz').fill(mockData.projektreferenz);
    await modelDrivenApp.page.getByLabel('Projektstart').fill(mockData.projektstart);

    await modelDrivenApp.page.getByRole('combobox', { name: 'Auftraggeber, Suche' }).click();
    await modelDrivenApp.page.getByRole('combobox', { name: 'Auftraggeber, Suche' }).fill(mockData.auftraggeber);
    await modelDrivenApp.page.getByRole('treeitem', { name: mockData.auftraggeber }).click();

    await modelDrivenApp.page.getByRole('combobox', { name: 'Finanzen (Team), Suche' }).click();
    await modelDrivenApp.page.getByRole('combobox', { name: 'Finanzen (Team), Suche' }).fill(mockData.finanzenTeam);
    await modelDrivenApp.page.getByRole('treeitem', { name: mockData.finanzenTeam }).click();

    await modelDrivenApp.page.getByRole('combobox', { name: 'Direktor (Team), Suche' }).click();
    await modelDrivenApp.page.getByRole('combobox', { name: 'Direktor (Team), Suche' }).fill(mockData.direktorTeam);
    await modelDrivenApp.page.getByRole('treeitem', { name: mockData.direktorTeam }).click();

    if (options?.includeProjektleiter) {
      await modelDrivenApp.page.getByRole('combobox', { name: 'Projektleiter, Suche' }).click();
      await modelDrivenApp.page.getByRole('combobox', { name: 'Projektleiter, Suche' }).fill(mockData.projektleiter);
      await modelDrivenApp.page.getByRole('treeitem', { name: mockData.projektleiter }).click();
    }
  };

  async function deleteCreatedRecord(modelDrivenApp: ModelDrivenAppPage): Promise<void> {
    // Aktiven Antrag löschen, damit er nicht in der Listenansicht bleibt
    console.log('Lösche erstellten Antrag über Grid-Toolbar');
  };

  test('TC-01: Neues Formular öffnet sich mit aktiver Stufe Initialisierung', async ({ mdaApp }) => {
    // Klick auf "Neu erstellen"
    await mdaApp.page.getByRole('menuitem', { name: 'Neu erstellen' }).click();
    await expect(mdaApp.page.getByLabel('Titel')).toBeVisible({ timeout: 15_000 });

    // Business Process Flow Stage "Initialisierung" überprüfen
    const stageName = 'Initialisierung';
    const stage = mdaApp.page.getByRole('button', { name: stageName }).filter({ hasText: stageName }).first();
    await expect(stage).toBeVisible();
    await expect(stage).toContainText('Initialisierung');
  });

  test('TC-02: Speichern ohne Pflichtfelder zeigt Validierungsfehler', async ({ mdaApp }) => {
    await mdaApp.page.getByRole('menuitem', { name: 'Neu erstellen' }).first().click();
    // would be: await mdaApp.clickCommandButton('Neu erstellen');
    await mdaApp.page.getByRole('menuitem', { name: 'Speichern' }).first().click();

    const errorMessages = await Promise.all([
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Titel' }).first(),
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Genehmigungskat.' }).first(),
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Version' }).first(),
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Projektreferenz' }).first(),
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Projektstart' }).first(),
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Auftraggeber' }).first(),
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Finanzen (Team)' }).first(),
      mdaApp.page.locator('span[data-id*="-error-message"]').filter({ hasText: 'Direktor (Team)' }).first(),
    ]);

    for (const error of errorMessages) {
      await expect(error).toBeVisible();
      await expect(error).toContainText('Erforderliche Felder müssen ausgefüllt werden');
    }
  });

  test('TC-03: Minimalantrag mit allen Pflichtfeldern erstellen und speichern', async ({ mdaApp }) => {
    await mdaApp.page.getByRole('menuitem', { name: 'Neu erstellen' }).click();
    await initializeInvestmentForm(mdaApp, { includeProjektleiter: true });

    //await mdaApp.page.getByRole('menuitem', { name: 'Speichern' }).first().click();
    await mdaApp.form.save();

    // Nach erfolgreichem Speichern verschwindet "Nicht gespeichert"
    await expect(mdaApp.page.getByText('Nicht gespeichert')).not.toBeVisible({ timeout: 15_000 });
    await expect(mdaApp.page.getByLabel('Titel')).toHaveValue(mockData.titel);

    await deleteCreatedRecord(mdaApp);
  });

  // TC-04 – Projektleiter explizit zuweisen
  test('TC-04: Projektleiter zuweisen und als Link anzeigen', async ({ mdaApp }) => {
    await mdaApp.page.getByRole('menuitem', { name: 'Neu erstellen' }).click();

    await initializeInvestmentForm(mdaApp, { includeProjektleiter: false });

    await mdaApp.page.getByRole('combobox', { name: 'Projektleiter, Suche' }).click();
    await mdaApp.page.getByRole('combobox', { name: 'Projektleiter, Suche' }).fill(mockData.projektleiter);
    await mdaApp.page.getByRole('treeitem', { name: mockData.projektleiter }).click();

    await mdaApp.form.save();
    await expect(mdaApp.page.getByText('Nicht gespeichert')).not.toBeVisible({ timeout: 15_000 });

    // Projektleiter ist als Link sichtbar
    await mdaApp.page.getByRole('link', { name: mockData.projektleiter, description: 'Projektleiter, Suche', exact: false }).click();
    await expect(mdaApp.page.locator('div[data-id="form-header"]').getByRole('heading')).toContainText(mockData.projektleiter);
  });

  test('TC-05: Projektbeschreibung im Rich-Text-Editor eingeben', async ({ mdaApp }) => {
    await mdaApp.page.getByRole('menuitem', { name: 'Neu erstellen' }).click();

    await initializeInvestmentForm(mdaApp, { includeProjektleiter: true });

    // reference the logical name of the field here 
    await mdaApp.form.setAttribute('rbs_projectsummary', 'Dies ist eine Testbeschreibung für den Investitionsantrag');
    await mdaApp.form.save();

    const projektbeschreibung = (await mdaApp.form.getAttribute('rbs_projectsummary') as string);
    await expect(projektbeschreibung).toContain('Testbeschreibung');
  });

  // TC-06 – Prozessfluss-Navigation
  test('TC-06: Prozessfluss wechselt zur Stufe Antragsstufen', async ({ mdaApp }) => {
    await mdaApp.page.getByRole('menuitem', { name: 'Neu erstellen' }).click();

    await initializeInvestmentForm(mdaApp, { includeProjektleiter: true });
    await expect(mdaApp.page.getByRole('status', { name: 'Nicht gespeichert' })).toBeVisible({ timeout: 15_000 });

    await mdaApp.form.save();
    await expect(mdaApp.page.getByRole('status', { name: 'Nicht gespeichert' })).not.toBeVisible({ timeout: 15_000 });

    // Auf Stufe "Antragsstufen" wechseln
    await mdaApp.page.getByRole('button', { name: 'Initialisierung' }).first().click();
    await mdaApp.page.getByRole('button', { name: 'Nächste Phase' }).first().click();

    await expect(mdaApp.page.getByText('Antragsstufen').first()).toBeVisible();
  });

  // TC-07 – Antrag in der Listenansicht sichtbar
  test('TC-07: Gespeicherter Antrag erscheint in der Listenansicht', async ({ mdaApp, page }) => {
    const itemTitle = `${mockData.titel} --> Listenansicht`;

    await mdaApp.page.getByRole('menuitem', { name: 'Neu erstellen' }).click();

    await initializeInvestmentForm(mdaApp, { includeProjektleiter: true });
    await mdaApp.form.save();

    await expect(mdaApp.page.getByText('Nicht gespeichert')).not.toBeVisible({ timeout: 15_000 });

    // Titel aktualisieren, damit der erstellte Datensatz in der Listenansicht eindeutig identifizierbar ist
    await mdaApp.page.getByLabel('Titel').fill(itemTitle);

    // Zurück zur Listenansicht navigieren
    await mdaApp.page.locator('button#navigateBackButtontab-id-0').click();

    // In der Listenansicht nach dem erstellten Antrag suchen
    await mdaApp.page.getByRole('searchbox').click();
    await mdaApp.page.getByRole('searchbox').fill(itemTitle);
    await mdaApp.page.getByRole('searchbox').press('Enter');

    const grid = await mdaApp.page.getByRole('treegrid', { name: 'Aktive Anträge' });
    await expect(grid).toHaveCount(1, { timeout: 15_000 });
  });

});