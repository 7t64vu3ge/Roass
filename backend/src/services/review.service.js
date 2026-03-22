import { getChatCompletion } from "./groq.service.js";
import { buildCodeReviewPrompt, buildDiffReviewPrompt } from "../constants/prompts.js";
import { safeParseJSON } from "../utils/parser.js";

/**
 * Reviews the provided code or diff using the Groq AI model.
 *
 * @param {object} params
 * @param {string} [params.code] - Full source code to review
 * @param {string} [params.diff] - Code diff to review (takes priority over code)
 * @param {string} [params.language] - Programming language of the code
 * @returns {Promise<object>} Structured review result with issues and summary
 */
export const reviewCode = async ({ code, diff, language = "unknown" }) => {
  const prompt = diff
    ? buildDiffReviewPrompt(diff, language)
    : buildCodeReviewPrompt(code, language);

  const rawResponse = await getChatCompletion(prompt);
  const parsed = safeParseJSON(rawResponse);

  return parsed;
};
