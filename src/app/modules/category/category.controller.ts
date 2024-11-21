import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { verifyToken } from '../Users/user.utils';
import { CategoryServices } from './category.service';

const createCategory = catchAsync(async (req, res) => {

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
  if (decoded.role == 'user') {
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
  body.createdBy=decoded._id;
  const result = await CategoryServices.createCategoryIntoDB(body);
  // const newResult = { ...result, createdBy: decoded._id};
  console.log(result)

  // const data = {
  //   _id: result._id,
  //   name:result.name,
  //   createdBy:decoded._id,
  //   createdAt: decoded.createdAt,
  //   updatedAt: decoded.updatedAt,
  // }

  res.status(200).json({
    success: true,
    statusCode: 201,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Categories are retrieved successfully.',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategory,
};
