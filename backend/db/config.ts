export default {
    host: process.env.SQL_DB_HOST || 'localhost',
    port: parseInt(process.env.SQL_DB_PORT || '5432', 10) || 5432,
    username: process.env.SQL_DB_USERNAME || 'postgres',
    password: process.env.SQL_DB_PASSWORD || 'postgres',
    name: process.env.SQL_DB_NAME || 'managedbetter',
};