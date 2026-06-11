import { Page } from "@playwright/test";
import * as OTPAuth from "otpauth";

export async function login(
  page: Page,
  loginUrl: string,
  username: string,
  password: string,
  otpSecret?: string
): Promise<void> {
  console.log("Login function called");

  if (!loginUrl) {
    loginUrl = 'https://login.microsoftonline.com/';
  }

  if (!username || !password) {
    throw new Error("Username and password must be provided for login.");
  }

  const isMfaEnabled = !!otpSecret;

  // Navigate to Microsoft 365 login
  await page.goto(loginUrl);

  // Fill in email
  await page.fill('input[type="email"]', username);
  await page.click('input[type="submit"]');

  // Fill in password
  await page.fill('input[type="password"]', password);
  await page.click('input[type="submit"]');


  // Only handle MFA if it's enabled
  if (isMfaEnabled) {
    // Handle MFA selection – try to select OTP method
    await page.waitForTimeout(1000);
    try {
      const otherWayLink = page.getByRole('link', { name: 'Sign in another way' });
      if (await otherWayLink.isVisible({ timeout: 2000 })) {
        await otherWayLink.click();

        // Get the option "Use a verification code"
        const otpLink = page.locator(`div[data-value="PhoneAppOTP"]`);
        await otpLink.click();
      }
    } catch (error) {
      console.error(error);
    }

    // Fill in the OTP code
    const otpInput = await page.waitForSelector("input#idTxtBx_SAOTCC_OTC");
    let totp = new OTPAuth.TOTP({
      issuer: "Microsoft",
      label: username,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: otpSecret,
    });
    const code = totp.generate();
    await otpInput.fill(code);

    await page.locator("input[type=submit]").click();
  }

  // Handle "Stay signed in?" prompt
  await page.waitForTimeout(1000);
  const staySignedInButton = await page.locator("input[type=submit][value='Yes']");
  if (staySignedInButton) {
    await staySignedInButton.click();
  }

  // Wait for navigation to complete (just load state, not networkidle)
  await page.waitForLoadState('load');

  // Give it a moment for authentication to settle
  await page.waitForTimeout(2000);
}