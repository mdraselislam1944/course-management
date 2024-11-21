import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';


const router = express.Router();

router.post(
  '/courses',
  validateRequest(CourseValidations.courseValidationSchema),
  CourseControllers.createCourse,
);
router.get('/courses', CourseControllers.getAllCourses);
router.put(
  '/courses/:courseId',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateACourse,
);

// getting course by id with review
router.get('/courses/:courseId/reviews', CourseControllers.getCourseWithReview);

//Get the Best Course Based on Average Review (Rating)
router.get("/course/best",CourseControllers.getCourseWithAverageAndRating);


export const CourseRoutes = router;
