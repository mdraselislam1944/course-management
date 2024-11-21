import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course Id is required.'],
    ref: 'category',
  },
  rating: {
    type: Number,
    required: [true, 'Ratting is required.'],
  },
  review: {
    type: String,
    required: [true, 'Review is required.'],
  },
  createdBy: {
    type: Schema.Types.ObjectId, 
    required: [true, 'Created by is required.'],
    ref: 'UserModel', 
  },
},
  {
    timestamps: true, 
  });

export const ReviewModel = model<TReview>('reviews', reviewSchema);

