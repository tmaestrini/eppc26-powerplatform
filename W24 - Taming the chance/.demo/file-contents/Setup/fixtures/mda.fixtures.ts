// fixtures/mda.fixtures.tis
import { createPowerAppFixture, AppType, AppLaunchMode, ModelDrivenAppPage } from '../toolkit';


export const test = createPowerAppFixture<{ mdaApp: ModelDrivenAppPage }>({
  mdaApp: {
    launchOptions: {
      app: process.env.MODEL_DRIVEN_APP_NAME || 'n/a',
      type: AppType.ModelDriven,
      mode: AppLaunchMode.Play,
      skipMakerPortal: true,
      // directUrl: process.env.MODEL_DRIVEN_APP_URL!,
      directUrl: `https://${process.env.MODEL_DRIVEN_APP_DOMAIN}/main.aspx?appid=${process.env.MODEL_DRIVEN_APP_ID}`
    },
    build: async (page) => new ModelDrivenAppPage(page),
  },
});

export { expect } from '@playwright/test';
// storageState is in playwright.config.ts — never set it here
