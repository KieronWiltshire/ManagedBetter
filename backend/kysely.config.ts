import { defineConfig } from "kysely-ctl";
import * as path from "path";
import { PostgresDialect } from "kysely";
import { NestFactory } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import sqlConfig from "./src/config/sql.config";
import { Pool } from "pg";

export default async function() {
    const app = await NestFactory.createApplicationContext(
        ConfigModule.forRoot({
          load: [sqlConfig],
        }),
        {
          logger: ['error', 'warn'],
        },
    );

    const configService = app.get(ConfigService);

    return defineConfig({
        dialect: new PostgresDialect({
            pool: new Pool({
                host: configService.get('sql.host'),
                port: configService.get('sql.port'),
                database: configService.get('sql.name'),
                user: configService.get('sql.username'),
                password: configService.get('sql.password')
            }),
        }),
        migrations: {
            migrationFolder: path.join(__dirname, 'db', 'migrations'),
        },
        seeds: {
            seedFolder: path.join(__dirname, 'db', 'seeds'),
        },
    });
};