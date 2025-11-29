import { defineConfig } from "kysely-ctl";
import * as path from "path";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import sqlConfig from "./src/config/sql.config";

const config = defineConfig({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: sqlConfig.host,
            port: sqlConfig.port,
            database: sqlConfig.name,
            user: sqlConfig.username,
            password: sqlConfig.password
        }),
    }),
    migrations: {
        migrationFolder: path.join(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
        seedFolder: path.join(__dirname, 'src', 'database', 'seeds'),
    },
});

export default config;