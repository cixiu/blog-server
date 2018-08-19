import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface ICategoryModel {
  id: number;
  title: string;
  create_time: string;
}

export type CategoryType = mongoose.Document & ICategoryModel;

const categorySchema = new Schema({
  id: { type: Number, default: +Date.now() },
  title: { type: String },
  create_time: { type: String },
});

categorySchema.index({ id: 1 });
const CategoryModel = mongoose.model('category', categorySchema);

export default CategoryModel;
