import { TReview } from './review.interface';
import { ReviewModel } from './review.model';

const createReviewIntoDB = async (review: TReview) => {
  const result = (await ReviewModel.create(review)).populate('createdBy', '-password -createdAt -updatedAt -passwordChangeHistory -__v');
  return result;
};

const getAllReviewsFromDB = async () => {
  const result = ReviewModel.find();
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
};
