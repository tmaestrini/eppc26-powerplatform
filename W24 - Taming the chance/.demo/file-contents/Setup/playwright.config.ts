import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    viewport: null, // Deaktiviert die feste Skalierung
    deviceScaleFactor: undefined, // Wichtig bei viewport: null
    launchOptions: {
      // --start-maximized wirkt nur im Headed-Mode.
      // --window-size stellt die Fenstergrösse auch im Headless-Mode sicher,
      // damit D365 das Formular zweispaltig rendert und alle Felder sichtbar sind.
      args: ['--start-maximized', '--window-size=1920,1080']
    },
  },
  projects: [
    {
      name: "setup",
      // testMatch: /login.setup.ts/,
      testMatch: /mfa.setup.ts/,
    },
    {
      name: "model-driven",
      // testIgnore: /login.setup.ts/, // Ignore the setup file
      // testIgnore: /mfa.setup.ts/, // Ignore the setup file
      testMatch: 'mda/**/*.test.ts',
      use: {
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"], // This will run the setup project before this project
    },
    {
      name: "canvas",
      // testIgnore: /login.setup.ts/, // Ignore the setup file
      // testIgnore: /mfa.setup.ts/, // Ignore the setup file
      testMatch: 'canvas/**/*.test.ts',
      use: {
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"], // This will run the setup project before this project
    },
    {
      name: "pac",
      // testIgnore: /login.setup.ts/, // Ignore the setup file
      // testIgnore: /mfa.setup.ts/, // Ignore the setup file
      testMatch: 'pac/**/*.test.ts',
      use: {
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"], // This will run the setup project before this project
    },
  ],
});