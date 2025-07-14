import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const connection = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_SENHA,
    database: process.env.DB_DATABASE,
    multipleStatements: true
  }
});
export default connection;
