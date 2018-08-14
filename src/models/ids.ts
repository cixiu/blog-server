import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IIds {
  admin_id: number;
  user_id: number;
  article_id: number;
  img_id: number;
}

export type IdType = mongoose.Document & IIds;

const idsSchema = new Schema({
  admin_id: { type: Number, default: 0 },
  user_id: { type: Number, default: 0 },
  article_id: { type: Number, default: 0 },
  img_id: { type: Number, default: 0 },
});

const Ids = mongoose.model('Ids', idsSchema);

// Ids.findOne((err, data) => {
//   if (!data) {
//     const newIds = new Ids({
//       admin_id: 0,
//       user_id: 0,
//       article_id: 0,
//       img_id: 0,
//     });
//     newIds.save();
//   }
// });

export default Ids;
