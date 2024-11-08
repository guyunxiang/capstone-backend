import mongoose from 'mongoose';
import { Database, Resource } from '@adminjs/mongoose';
import AdminJS from 'adminjs';

AdminJS.registerAdapter({ Database, Resource });

// eslint-disable-next-line max-len
const DATABASE_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const initialize = async () => {
  const db = await mongoose.connect(DATABASE_URL);

  return { db };
};

export default initialize;
