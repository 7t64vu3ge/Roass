/**
 * Validates the review request body.
 * Requires either `code` or `diff` to be a non-empty string.
 */
export const validateReviewRequest = (req, res, next) => {
  const { code, diff, language } = req.body;

  if (!code && !diff) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Request body must include either 'code' or 'diff' as a non-empty string.",
    });
  }

  if (code && typeof code !== "string") {
    return res.status(400).json({
      error: "Validation failed",
      message: "'code' must be a string.",
    });
  }

  if (diff && typeof diff !== "string") {
    return res.status(400).json({
      error: "Validation failed",
      message: "'diff' must be a string.",
    });
  }

  if (language && typeof language !== "string") {
    return res.status(400).json({
      error: "Validation failed",
      message: "'language' must be a string.",
    });
  }

  next();
};
