import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewControllers } from './review.controller';
import { ReviewValidations } from './review.validation';
const router = express.Router();

router.post(
  '/',
  validateRequest(ReviewValidations.reviewValidationSchema),
  ReviewControllers.createReview,
);
router.get('/', ReviewControllers.getAllReviews);

export const ReviewRoutes = router;
