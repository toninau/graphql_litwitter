import * as dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.SECRET;
const PORT = process.env.PORT;
const URL = process.env.DATABASE_URL;

export default {
  SECRET,
  PORT,
  URL
};