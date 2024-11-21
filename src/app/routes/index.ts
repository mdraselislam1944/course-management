import { Router } from 'express';

import { ReviewRoutes } from '../modules/review/review.router';
import { CategoryRoutes } from '../modules/category/category.route';
import { CourseRoutes } from '../modules/Course/course.route';
import { UserRoutes } from '../modules/Users/user.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/',
    route: CourseRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path:"/auth",
    route:UserRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
