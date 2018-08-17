import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUserModel {
  username: string;
  password: string;
  id: string;
  avatar: string;
  createAt: number;
  create_time: string;
  create_address: string;
}

export type UserType = mongoose.Document & IUserModel;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: Number },
  avatar: { type: String, default: '' },
  createAt: { type: Number },
  create_time: { type: String },
  create_address: { type: String },
});

userSchema.index({ id: 1 });
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
