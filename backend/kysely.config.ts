import { defineConfig } from "kysely-ctl";
import * as path from "path";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import dbConfig from "./db/config";

export default defineConfig({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.name,
            user: dbConfig.username,
            password: dbConfig.password
        }),
    }),
    migrations: {
        migrationFolder: path.join(__dirname, 'db', 'migrations'),
    },
    seeds: {
        seedFolder: path.join(__dirname, 'db', 'seeds'),
    },
});