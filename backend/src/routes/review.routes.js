import { Router } from "express";
import { handleReview } from "../controllers/review.controller.js";
import { validateReviewRequest } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/", validateReviewRequest, handleReview);

export default router;
