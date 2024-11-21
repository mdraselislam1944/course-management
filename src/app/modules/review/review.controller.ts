import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { verifyToken } from '../Users/user.utils';
import { ReviewServices } from './review.service';
import mongoose from 'mongoose';

const createReview = catchAsync(async (req, res) => {

  const authorization = req?.headers?.authorization;
  const decoded = verifyToken(authorization as string, config.JWT_ACCESS_SECRET as string);
  if (!authorization) {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
      errorMessage: "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null
    });
    return;
  }
  if (decoded.role != 'user') {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
      errorMessage: "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null
    });
    return;
  }
  const body=req.body;
  const validCourseId = new mongoose.Types.ObjectId(body.courseId);
  body.courseId=validCourseId
  body.createdBy=decoded._id;
  const result = await ReviewServices.createReviewIntoDB(body);

  res.status(200).json({
    result: true,
    statusCode: 201,
    message: 'Review is created successfully.',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviewsFromDB();

  res.status(200).json({
    success: true,
    message: 'Reviews are retrieved successfully!',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviews,
};
