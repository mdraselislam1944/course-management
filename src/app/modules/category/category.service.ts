import { TCategoryName } from './category.interface';
import { CategoryModel } from './category.model';

const createCategoryIntoDB = async (category: TCategoryName) => {
  const result = CategoryModel.create(category);
  return result;
};
const getAllCategoriesFromDB = async () => {
  const result = CategoryModel.find() .populate('createdBy', '-password -createdAt -updatedAt -passwordChangeHistory -__v');
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
