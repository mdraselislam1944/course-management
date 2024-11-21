import { Schema, model, Document, Types, Model } from 'mongoose';

import { TCourse, TDetails, TTags } from './course.interface';
import AppError from '../../errors/AppError';

const tagSchema = new Schema<TTags>({
  name: {
    type: String,
    required: [true, 'Tags are required.'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const detailsSchema = new Schema<TDetails>({
  level: {
    type: String,
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
    },
    required: [true, 'Level is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
});

interface CourseDocument extends Document {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTags[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks?: number;
  details: TDetails;
  createdBy: Types.ObjectId; // Reference to the user collection
}

const courseSchema = new Schema<TCourse, Model<CourseDocument>>({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    unique: true,
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required.'],
  },
  categoryId: {
    // type: Schema.Types.ObjectId, // Change this line
    // required: [true, 'Created by is required.'],
    // ref: 'UserModel', // Replace 'User' with the actual name of your user model
    type: Schema.Types.ObjectId, // Change this line
    required: [true, 'Category id is required.'],
    ref: 'category',
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
  },
  tags: {
    type: [tagSchema],
    required: [true, 'Tags are required.'],
  },
  startDate: {
    type: String,
    required: [true, 'Start date is required.'],
  },
  endDate: {
    type: String,
    required: [true, 'End date is required.'],
  },
  language: {
    type: String,
    required: [true, 'Language is required.'],
  },
  provider: {
    type: String,
    required: [true, 'Provider name is required.'],
  },
  durationInWeeks: {
    type: Number,
    required: false,
  },
  details: {
    type: detailsSchema,
    required: [true, 'Detail is required.'],
  },
  createdBy: {
    type: Schema.Types.ObjectId, // Change this line
    required: [true, 'Created by is required.'],
    ref: 'UserModel', // Replace 'User' with the actual name of your user model
  },
},
{
  timestamps: true, // Add createdAt and updatedAt fields
});

courseSchema.pre('save', async function (next) {
  const isCourseExists = await CourseModel.findOne({
    title: this.title,
  });
  if (isCourseExists) {
    throw new AppError(404, 'This course already exists.');
  }
  next();
});

courseSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isCourseExists = await CourseModel.findOne(query);
  if (!isCourseExists) {
    throw new AppError(404, 'This course does not exist.');
  }
  next();
});

export const CourseModel = model<TCourse, Model<CourseDocument>>('Course', courseSchema);
