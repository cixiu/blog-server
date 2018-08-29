import * as mongoose from 'mongoose';

interface ISessionModel {
  _id: string;
  id: string;
  data: {
    _expires: number;
    _maxAge: number;
    [index: string]: number | string;
  };
  updateAt: Date;
}

const sessionSchema = new mongoose.Schema({
  _id: String,
  id: String,
  data: Object,
  updateAt: {
    default: new Date(),
    expires: 86400, // 1 day
    type: Date,
  },
});

sessionSchema.index({ id: 1 });

export type SessionType = mongoose.Document & ISessionModel;

const SessionModel = mongoose.model('Session', sessionSchema);

class MongooseStore {
  public static create() {
    return new MongooseStore();
  }

  public session: mongoose.Model<any>;

  constructor() {
    this.session = SessionModel;
  }

  public async destroy(id: string) {
    const { session } = this;
    return session.remove({ _id: id });
  }

  public async get(id: string) {
    const { session } = this;
    const { data } = (await session.findOne({ _id: id })) || { data: {} };
    return data;
  }

  public async set(
    id: string,
    data: any,
    maxAge: number,
    { changed, rolling }: any,
  ) {
    if (changed || rolling) {
      const { session } = this;
      const record = { _id: id, id, data, updatedAt: new Date() };
      await session.findByIdAndUpdate(id, record, { upsert: true });
    }
    return data;
  }
}

export { SessionModel };

export default MongooseStore;
