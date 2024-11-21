import { Request, Response } from "express";
import { userService } from "./user.service";
import bcrypt from 'bcrypt';
import config from "../../config";
import { verifyToken } from "./user.utils";
// import userInformationSchemaValidation from "./user.validation";

const createUser = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const saltRounds = parseInt(config.bcrypt_salt_rounds || '10', 10);
        if (isNaN(saltRounds)) {
            throw new Error('Invalid salt rounds configuration');
        }

        bcrypt.hash(user.password, saltRounds, async function (err, hash) {
            if (err) {
                throw err;
            }

            // const result = await userService.createUserIntoDB({ ...user, password: hash });
            const result = await userService.createUserIntoDB({ ...user, password: hash });
            res.status(201).json({ status: true, message: "User is created", data: result });
        });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "User is not created", data: error.message });
    }
};


const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.showAllUsers();

        if (!result) {
            res.status(200).json({
                success: true,
                message: 'users can not found',
                data: result,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Students are retrieved succesfully',
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err,
        });
    }
};


const getSingleUser = async (req: Request, res: Response) => {
    try {
        const userId = req.body;
        const result = await userService.getSingleUserFromDB(userId);

        if (!result) {
            res.status(200).json({
                success: true,
                message: 'user can not found',
                data: result,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User is retrieved succesfully',
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const result = await userService.deleteUserFromDB(userId);

        if (!result) {
            res.status(200).json({
                success: true,
                message: 'user can not found',
                data: result,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Student is deleted succesfully',
            data: null,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const data = req.body
        const result = await userService.updateUserFromDB(userId, data);

        if (!result) {
            res.status(200).json({
                success: true,
                message: 'user can not found',
                data: result,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'user is updated succesfully',
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err,
        });
    }
};

// const AddProductUser = async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const product = req.body;
//     try {

//         // Check if req.body is empty
//         if (!product) {
//             res.status(400).json({
//                 success: false,
//                 message: 'Request body is empty',
//                 error: null,
//             });
//             return;
//         }

//         const result = await userService.addProduct(userId, product);

//         if (!result) {
//             res.status(404).json({
//                 success: false,
//                 message: 'User not found',
//                 data: null,
//             });
//             return;
//         }

//         // Move the console.log here or remove it
//         console.log("hello world");

//         res.status(200).json({
//             success: true,
//             message: 'Order created successfully!',
//             data: null,
//         });
//     } catch (err: any) {
//         res.status(500).json({
//             success: false,
//             message: err.message || 'Something went wrong',
//             error: err,
//         });
//     }
// };



// const getAllProduct = async (req: Request, res: Response) => {
//     try {
//         const { userId } = req.params;
//         const result = await userService.AllGetProduct(userId);
//         if (!result) {
//             res.status(200).json({
//                 success: true,
//                 message: 'user can not found',
//                 data: result,
//             });
//             return;
//         }
//         res.status(200).json({
//             success: true,
//             message: "Order fetched successfully!",
//             data: { orders: result },
//         });
//     } catch (err: any) {
//         res.status(500).json({
//             success: false,
//             message: err.message || 'something went wrong',
//             error: err,
//         });
//     }
// }

// const TotalPrice = async (req: Request, res: Response) => {
//     try {
//         const { userId } = req.params;
//         const result = await userService.sumOfAllProduct(userId);
//         if (!result) {
//             res.status(200).json({
//                 success: true,
//                 message: 'user can not found',
//                 data: result,
//             });
//             return;
//         }
//         res.status(200).json({
//             success: true,
//             message: "Total price calculated successfully!",
//             data: { totalPrice: result },
//         });
//     } catch (err: any) {
//         res.status(500).json({
//             success: false,
//             message: err.message || 'something went wrong',
//             error: err,
//         });
//     }
// }

const changePassword = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      
      const authorization = req.headers.authorization;

      if (!authorization) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access",
            errorMessage: "You do not have the necessary permissions to access this resource.",
            errorDetails: null,
            stack: null
        });
      }

      const decoded = verifyToken(authorization as string, config.JWT_ACCESS_SECRET as string);

      if (decoded && decoded.exp) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
      
        if (decoded.exp < currentTimestamp) {
            return res.status(401).json({
                success: false,
                message: "token is expired",
                errorMessage: "You do not have the necessary permissions to access this resource.",
                errorDetails: null,
                stack: null
            });
        }

        if(!data.newPassword){
            return res.status(200).json({
                success: false,
                message: "Your sending data is not perfect",
                data: null,
              });
          }
          
      
          const saltRounds = parseInt(config.bcrypt_salt_rounds || '10', 10);
          if (isNaN(saltRounds)) {
            throw new Error('Invalid salt rounds configuration');
          }
      
          // Hash the new password asynchronously
          const hashedPassword = await bcrypt.hash(data.newPassword, saltRounds);
          data.checkPassword=data.newPassword;
          data.newPassword = hashedPassword;

          const result = await userService.changePasswordDB(authorization, data);
          if(!result){
            res.status(400).json({
                success: false,
                message: "Password change failed. Ensure the new password is unique and not among the last 2 used (last used on 2023-01-01 at 12:00 PM).",
                data: null,
              });
              return;
          }
          res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Password changed successfully",
                data:result,
          })

      } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access",
            errorMessage: "You do not have the necessary permissions to access this resource.",
            errorDetails: null,
            stack: null
        });
      }

    } catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({
              success: false,
              message: "token is expired",
              errorMessage: "You do not have the necessary permissions to access this resource.",
              errorDetails: error.message,
              stack: null
            });
          } else {
            console.error("Unexpected error:", error);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
              errorDetails: "Unexpected error occurred"
            });
          }
    }
  };
  

export const userController = {
    createUser, getUsers, getSingleUser, deleteUser, updateUser,changePassword
};