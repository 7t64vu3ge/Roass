import { reviewCode } from "../services/review.service.js";

/**
 * POST /api/review
 * Handles code review requests — delegates to the review service.
 */
export const handleReview = async (req, res, next) => {
  try {
    const { code, diff, language } = req.body;
    const result = await reviewCode({ code, diff, language });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
