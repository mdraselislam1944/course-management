import { Schema, model } from 'mongoose';

import { TCategoryName } from './category.interface';
import AppError from '../../errors/AppError';

const categorySchema = new Schema<TCategoryName>({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    unique: true,
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

categorySchema.pre('save', async function (next) {
  const isCategoryExists = await CategoryModel.findOne({
    name: this.name,
  });
  if (isCategoryExists) {
    throw new AppError(404, 'This category already exits.');
  }
  next();
});

export const CategoryModel = model<TCategoryName>('category', categorySchema);
