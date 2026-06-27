// fixtures/mda.fixtures.tis
import { FrameLocator, Locator, Page } from 'playwright-core';
import { createPowerAppFixture, AppType, AppLaunchMode, CanvasAppRuntimePage } from '../toolkit';

export class CodeAppPage extends CanvasAppRuntimePage {
  private readonly frame: FrameLocator;

  get app(): FrameLocator {
    // Code App content is rendered inside an iframe within <main> – that's why we return the frame here, not the page.
    return this.frame;
  }

  /** Escape hatch when access to the outer Power Apps player page is required. */
  get host(): Page {
    return this.page;
  }

  constructor(page: Page) {
    super(page);
    // The Code App iframe inside <main> has no stable name/title, so we resolve it via its DOM position.
    this.frame = page.getByRole('main').locator('iframe').contentFrame();
  }

  public getControl(options: { name: string }): Locator {
    return this.frame.locator(`[data-control-name="${options.name}"]`);
  }

  getButton(controlName: string): Locator {
    return this.getControl({name: controlName});
  }
}


export const test = createPowerAppFixture<{codeApp: CodeAppPage}>({
  codeApp: {
    launchOptions: {
      app: process.env.CODE_APP_NAME || 'n/a',
      type: AppType.Canvas, // Code App is treated like a Canvas App
      mode: AppLaunchMode.Play,
      skipMakerPortal: true,
      directUrl: `https://apps.powerapps.com/play/e/${process.env.POWER_APPS_ENVIRONMENT_ID}/app/${process.env.CODE_APP_ID}?tenantId=${process.env.CODE_APP_TENANT_ID}`,
    },
    build: async (page) => new CodeAppPage(page),
  },
});

export { expect } from '@playwright/test';
// storageState is in playwright.config.ts — never set it here
