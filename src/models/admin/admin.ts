import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IAdminModel {
  user_name: string;
  password: string;
  type: number;
  id: string;
  avatar: string;
  create_time: string;
  create_address: string;
  admin: string;
}

export type AdminType = mongoose.Document & IAdminModel;

const adminSchema = new Schema(
  {
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: Number }, // 0 => 超级管理员， 1 => 普通管理员
    id: { type: String, required: true },
    avatar: { type: String, default: '' },
    create_time: { type: String },
    create_address: { type: String },
    admin: { type: String, default: '管理员' },
  },
  { _id: false },
);

adminSchema.index({ id: 1 });
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
