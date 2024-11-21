import { Schema, model } from "mongoose";
import { tUserInformation } from "./user.interface";
const UserSchema = new Schema<tUserInformation>({
    username: { type: String, required: true, unique:true },
    password: { type: String, required: true,unique:true, select: 0 },
    email: { type: String, required: true },
    role: { type: String, required: true },
    passwordChangeHistory: {
        type: [{ password: String, timestamp: Date }],
        default: [],
        select: 0,
      },
},{
    timestamps: true,
});

export const User=model<tUserInformation>('UserModel',UserSchema);