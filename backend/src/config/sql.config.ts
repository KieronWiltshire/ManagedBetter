import { registerAs } from '@nestjs/config';

export default registerAs('sql', () => ({
  host: process.env.SQL_DB_HOST || 'localhost',
  port: parseInt(process.env.SQL_DB_PORT || '3306', 10) || 3306,
  username: process.env.SQL_DB_USERNAME || 'postgres',
  password: process.env.SQL_DB_PASSWORD || 'postgres',
  name: process.env.SQL_DB_NAME || 'managedbetter',
}));
