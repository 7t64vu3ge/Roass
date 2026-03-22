/**
 * Safely parse a JSON string from an AI response.
 * Handles cases where the response may contain markdown code blocks or extra text.
 *
 * @param {string} raw - The raw string response from the AI
 * @returns {object} Parsed JSON object, or a fallback error object
 */
export const safeParseJSON = (raw) => {
  const fallback = {
    issues: [],
    summary: "Failed to parse AI response",
  };

  if (!raw || typeof raw !== "string") {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    // Attempt to extract JSON from markdown code blocks
    const jsonBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
      try {
        return JSON.parse(jsonBlockMatch[1].trim());
      } catch {
        // fall through
      }
    }

    // Attempt to extract a raw JSON object from the string
    const objectMatch = raw.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        // fall through
      }
    }

    return fallback;
  }
};
