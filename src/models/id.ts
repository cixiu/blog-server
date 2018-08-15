import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IId {
  admin_id: number;
  user_id: number;
  article_id: number;
  img_id: number;
}

export type IdType = mongoose.Document & IId;

const idSchema = new Schema({
  admin_id: { type: Number, default: 0 },
  user_id: { type: Number, default: 0 },
  article_id: { type: Number, default: 0 },
  img_id: { type: Number, default: 0 },
});

const Id = mongoose.model('Id', idSchema);

Id.findOne((err: any, data: IdType) => {
  if (!data) {
    const newId = new Id({
      admin_id: 0,
      user_id: 0,
      article_id: 0,
      img_id: 0,
    });
    Id.create(newId);
  }
});

export default Id;
