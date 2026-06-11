
import * as OTPAuth from "otpauth";

const args = process.argv;

if (args[2] === undefined) {
  console.error("⚠️  Please provide the OTP secret as first argument.");
  process.exit(1);
}

let totp = new OTPAuth.TOTP({
  issuer: "Microsoft",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: args[2],
});

console.log(`TOTP Code for setup: ${totp.generate()}`);