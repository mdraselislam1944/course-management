import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { verifyToken } from '../Users/user.utils';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
const authorization=req?.headers?.authorization;
  const decoded = verifyToken(authorization as string, config.JWT_ACCESS_SECRET as string);
  if(!authorization){
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
      errorMessage: "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null
    });
    return;
  }
  if(decoded.role=='user'){
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
      errorMessage: "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null
    });
    return;
  }
  const result = await CourseServices.createCourseIntoDB(req.body);
  res.status(200).json({
    success: true,
    statusCode: 201,
    message: 'Course is created successfully!',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const data=req.query;
  const result = await CourseServices.getAllCoursesFromDB(data);
  res.status(200).json({
    success: true,
    statusCode: 200,

    message: 'Courses are retrieved successfully!',
    data: result,
  });
});

const updateACourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const course = req.body;

  const authorization=req?.headers?.authorization;
  const decoded = verifyToken(authorization as string, config.JWT_ACCESS_SECRET as string);
  if(!authorization){
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
      errorMessage: "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null
    });
    return;
  }
  if(decoded.role=='user'){
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
      errorMessage: "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null
    });
    return;
  }



  const result = await CourseServices.updateACourseIntoDB(courseId, course);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Course is updated successfully!',
    data: result,
  });
});

// getting single course by id with review
const getCourseWithReview = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const result = await CourseServices.getCourseWithReviewFromDB(courseId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Data is retrieved successfully!',
    data: result,
  });
});

//Get the Best Course Based on Average Review (Rating)
const getCourseWithAverageAndRating= catchAsync(async (req, res) => {
  const result = await CourseServices.getCourseWithReviewAndRatingFromDB();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Data is retrieved successfully from 3 collection!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  updateACourse,
  getCourseWithReview,
  getCourseWithAverageAndRating,
};
