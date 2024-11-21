import {  Types } from 'mongoose';
export type TCategoryName = {
  name: string;
  createdBy: Types.ObjectId; 
};
