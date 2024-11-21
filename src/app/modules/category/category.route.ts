import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryControllers } from './category.controller';
import { CategoryValidations } from './category.validation';
const route = express.Router();

route.post(
  '/',
  validateRequest(CategoryValidations.categoryValidationSchema),
  CategoryControllers.createCategory,
);
route.get('/', CategoryControllers.getAllCategory);

export const CategoryRoutes = route;
