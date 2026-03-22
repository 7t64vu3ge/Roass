import groq from "../config/groq.js";
import { SYSTEM_PROMPT } from "../constants/prompts.js";

/**
 * Sends a chat completion request to Groq with the given prompt.
 *
 * @param {string} userPrompt - The user-facing prompt to send to the model
 * @returns {Promise<string>} The raw text content from the AI response
 */
export const getChatCompletion = async (userPrompt) => {
  const response = await groq.chat.completions.create({
    model: "groq/compound-mini",
    temperature: 0.2,
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response received from Groq API");
  }

  return content;
};
