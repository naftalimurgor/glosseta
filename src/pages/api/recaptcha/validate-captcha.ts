import fetch from "node-fetch";
/**
 * @description recAPTCHA Validation interface from the V2 api.
 * @param {boolean} success True/false if captcha validation was sucessful/not sucessful.
 * @param {number} timestamp Timestamp of challenge.
 * @param {string} hostname The hostname where the reCAPCHA was solved.
 */
export type CaptchaValidationResult = {
  success: boolean,
  challenge_ts: number,
  hostname: string,
  "error-codes"?: Array<number>
}

export default async function validateCaptchaToken(captchaToken: string) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' };
  const captchaValidationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY_DEV}&response=${captchaToken}`;

  try {
    const response = await fetch(captchaValidationUrl, { headers, method: "POST" });
    const captchaValidation = await response.json() as CaptchaValidationResult
    return captchaValidation.success
  } catch (error: any) {
    console.info(`Failed to validated captchaToken with`, error)
    throw new Error(error?.message)
  }
}
