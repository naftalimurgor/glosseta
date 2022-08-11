import type { NextApiRequest, NextApiResponse } from "next"
import validator from "validator";

import validateCaptchaToken from "../recaptcha/validate-captcha";
import { createDefinitionIntakeIssue } from "../github/github-client"

const RESPONSE_MSG = {
  FAILED: "Failed to process Request",
  NOT_FOUND: "Not found",
  SUCCESS: "Ok"
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { captchaToken } = req.body;
    const { term, category, reason: context } = sanitize(req.body);

    try {
      const isRecaptchaTokenValid = await validateCaptchaToken(captchaToken);
      const isValidCategory = validateCategory(req.body?.category);
      
      if (isRecaptchaTokenValid && isValidCategory) {
        const res = await createDefinitionIntakeIssue({ term, category, context });
        return res.status(200).json({ res });
      }

      return res.status(422).json({ msg: RESPONSE_MSG.FAILED });
    } catch (error) {
      console.log(error);
      return res.status(422).json({ sucess: false, msg: RESPONSE_MSG.FAILED });
    }
  }
  return res.status(404).json({ sucess: false, msg: RESPONSE_MSG.NOT_FOUND });
}

type RequestBody = {
  term: string,
  category: Category,
  reason: string,
}

type Category = "DAO" | "Protocol" | "Token" | "Application" | "Finance" | "General"

function sanitize(body: RequestBody) {
  let term = validator.trim(body.term)
  let category = validator.trim(body.category)
  let reason = validator.trim(body.reason)
  return { term, category, reason }
}

function validateCategory(category: Category): boolean {

  switch (category) {
    case "DAO":
      return true
    case "Protocol":
      return true
    case "Token":
      return true
    case "Application":
      return true
    case "Finance":
      return true
    case "General":
      return true
    default:
      return false;
  }
}
