import express from 'express';
import { userController } from './user.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { userValidations } from './user.validation';
const router = express.Router();
router.post("/register",
// validateRequest(userValidations.userSchema),
userController.createUser);
router.get("/users",userController.getUsers);
router.post('/login',userController.getSingleUser);
router.post("/change-password",userController.changePassword);
router.delete('/users/:userId',userController.deleteUser);
router.put("/users/:userId",userController.updateUser);
// router.put("/users/:userId/orders",userController.AddProductUser);
// router.get("/users/:userId/orders",userController.getAllProduct);
// router.get("/users/:userId/orders/total-price",userController.TotalPrice);

export const UserRoutes = router;