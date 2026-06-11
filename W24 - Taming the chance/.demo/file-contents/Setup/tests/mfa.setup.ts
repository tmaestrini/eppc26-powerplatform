import { test as setup } from "@playwright/test";
import { login } from "../helpers/setup-login";

const AuthFile = "playwright/.auth/user.json";

setup.use({
  trace: 'off',
  video: 'off',
  screenshot: 'off'
});

setup("authenticate", async ({ page }) => {
  await login(page,
    process.env.M365_URL || 'https://login.microsoftonline.com/',
    process.env.USERNAME || '',
    process.env.PASSWORD || '',
    process.env.OTP_SECRET || '');

  await page.context().storageState({ path: AuthFile });
});