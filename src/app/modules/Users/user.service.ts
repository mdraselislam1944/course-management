import { tUserInformation } from "./user.interface";
import { User } from "./user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../../config";
import { verifyToken } from "./user.utils";

const createUserIntoDB = async (user: tUserInformation) => {
    try {
      const createdUser = await User.create(user);
      const result = await User.findById(createdUser._id).select({ password: 0,passwordChangeHistory:0 });
      return result;
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error (e.g., duplicate username or email)
        throw new Error('Duplicate value. This username or email is already in use.');
      }
      throw error; // Re-throw other errors
    }
  };
  

const showAllUsers = async () => {
    const result = await User.find().select({ username: 1, fullName: 1, age: 1, email: 1, address: 1 });
    return result;
}
const getSingleUserFromDB = async (userInfo: tUserInformation) => {
    const result = await User.findOne({ username: userInfo.username }).select('+password',);
    if (!result) {
        return null; 
    }
    const isPasswordMatch = await bcrypt.compare(userInfo.password, result.password);
    if (isPasswordMatch) {
        const userWithoutPassword = { ...result.toObject(), password: undefined };
        const token = jwt.sign(userWithoutPassword, config.JWT_ACCESS_SECRET as string, { expiresIn: '1h' });
        const userData={
            user:userWithoutPassword,
            token:token
        }
        return userData;
    }
    return null; 
};


const deleteUserFromDB = async (userId: string) => {

    const result = await User.findOneAndDelete({ userId });
    return result;
};

const updateUserFromDB = async (userId: string, data: any) => {
    const result = await User.findOneAndUpdate({ userId: userId }, { $set: data }, { new: true });
    return result;
};

// const addProduct = async (userId: string, product: any) => {
//     const user = await User.findOne({ userId });
//     if (!user) {
//         return null;
//     }
//     user.orders.push(product);
//     const result = await user.save();
//     return result;
// }

// const AllGetProduct=async(userId: string)=>{
//     const user = await User.findOne({ userId }).select({ 'orders._id': 0 });
//     if (!user) {
//         return null;
//     }
//     return user.orders;
// }

// const sumOfAllProduct=async(userId: string)=>{
//     const user = await User.findOne({ userId:userId }).select({_id:1});
//     if (!user) {
//         return null;
//     }
//     const productSum = await User.aggregate([
//         { $match: { _id: user?._id} },
//         { $unwind: "$orders" },
//         {
//             $group: {
//                 _id: 0,
//                 totalAmount: { $sum: "$orders.price" },
//             },
//         },
//     ]);
//     return productSum;
// }

// const changePasswordDB=async(payload:string,body: { currentPassword: string, newPassword: string})=>{
//     const decoded = verifyToken(payload, config.JWT_ACCESS_SECRET as string);
//     const userInfo=await User.findOne({username:decoded.username}).select('+password');
//     if(!userInfo){
//         return null;
//     }
//     const isPasswordMatch = await bcrypt.compare(body.currentPassword, userInfo.password);
//     if (!isPasswordMatch) {
//         return null;
//     }

//     const result = await User.findByIdAndUpdate(userInfo._id, { password: body.newPassword }, { upsert: true });
//     return result;
// }

const changePasswordDB = async (payload: string, body: { currentPassword: string, newPassword: string,checkPassword:string }) => {
    try {
      const decoded = verifyToken(payload, config.JWT_ACCESS_SECRET as string);
      const userInfo = await User.findOne({ username: decoded.username }).select('+password +passwordChangeHistory');
  
      if (!userInfo) {
        return null;
      }

      let isPasswordMatch = await bcrypt.compare(body.currentPassword, userInfo.password);
      if (!isPasswordMatch) {
        return null;
      }

      isPasswordMatch = await bcrypt.compare(body.checkPassword, userInfo.password);
      if (isPasswordMatch) {
        return null;
      }

      // Check if the new password is among the last 2 passwords or the current one
      const newPasswordMatchesHistory = (
        await Promise.all(
          userInfo.passwordChangeHistory.map(async (change) => {
            return await bcrypt.compare(body.checkPassword, change.password);
          })
        )
      ).some((isMatch) => isMatch);

      console.log(newPasswordMatchesHistory+"  change call")
      if (newPasswordMatchesHistory) {
        // Password change fails if the new password matches any of the last 2 passwords or the current one
        return null;
      }
     
      // Add the new password to the password change history
      const hashedNewPassword = await bcrypt.hash(body.checkPassword, 10);
      userInfo.passwordChangeHistory.unshift({ password: hashedNewPassword, timestamp: new Date() });
      userInfo.passwordChangeHistory = userInfo.passwordChangeHistory.slice(0, 2); // Keep only the last 2 changes
  
      // Update the user document with the new password and password change history
      const result = await User.findByIdAndUpdate(
        userInfo._id,
        { password: body.newPassword, passwordChangeHistory: userInfo.passwordChangeHistory },
        { upsert: true }
      ).select({passwordChangeHistory:0});
      // console.log(result)
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  

export const userService = {
    createUserIntoDB,
    showAllUsers,
    getSingleUserFromDB,
    deleteUserFromDB,
    updateUserFromDB,
    // addProduct,
    // AllGetProduct,
    // sumOfAllProduct,
    changePasswordDB
};
