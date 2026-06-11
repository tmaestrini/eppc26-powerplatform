// fixtures/mda.fixtures.tis
import { FrameLocator, Locator, Page } from 'playwright-core';
import { createPowerAppFixture, AppType, AppLaunchMode, CanvasAppPage } from '../toolkit';

export class ConcreteCanvasAppPage extends CanvasAppPage {
  private readonly frame: FrameLocator;

  constructor(page: Page) {
    super(page);
    this.frame = page.frameLocator('iframe[name="fullscreen-app-host"]');
  }

  override getControl(options: { name: string }): Locator {
    return this.frame.locator(`[data-control-name="${options.name}"]`);
  }

  getLabel(controlName: string): Locator {
    return this.getControl({name: controlName}).locator('pre.fui-Text');
  }

  getButton(controlName: string): Locator {
    return this.getControl({name: controlName}).locator('button.fui-Button');
  }

  getInputField(controlName: string): Locator {
    return this.getControl({name: controlName}).locator('span.fui-Input input');
  }

  getDropdown(controlName: string): Locator {
    return this.getControl({name: controlName}).locator('div.fui-Combobox input');
  }

  getToolbarButton(controlName: string): Locator {
    return this.getControl({name: controlName}).locator(`div[role="toolbar"] button[value="${controlName}"].fui-Button`);
  }

  async getDropdownOption(dropdownName: string, optionText?: string): Promise<Locator> {
    await this.getDropdown(dropdownName).click();
    if (optionText) {
      return this.getControl({name: dropdownName}).locator('div[role="option"]', { hasText: optionText });
    } else {
      return this.getControl({name: dropdownName}).locator('div[role="option"]').first();
    }
  }

  getCustomComponent(componentName: string): Locator {
    return this.getControl({name: componentName}).locator('div.canvasContentDiv');
  }
}

export const test = createPowerAppFixture<{ canvasApp: ConcreteCanvasAppPage }>({
  canvasApp: {
    launchOptions: {
      app: process.env.CANVAS_APP_NAME || 'n/a',
      type: AppType.Canvas,
      mode: AppLaunchMode.Play,
      skipMakerPortal: true,
      directUrl: `https://apps.powerapps.com/play/e/${process.env.POWER_APPS_ENVIRONMENT_ID}/a/${process.env.CANVAS_APP_ID}?tenantId=${process.env.CANVAS_APP_TENANT_ID}`,
    },
    build: async (page) => new ConcreteCanvasAppPage(page),
  },
});

export { expect } from '@playwright/test';
// storageState is in playwright.config.ts — never set it here
