import { ClassSerializerInterceptor, Inject, MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { PostgresModule } from '@/postgres/postgres.module';
import { RedisModule } from '@/redis/redis.module';
import { REDIS_CLIENT } from '@/redis/constants/redis.constants';
import { LoggerModule } from 'nestjs-pino';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import Redis from 'ioredis';
import Keyv from 'keyv';
import { KeyvAnyRedis } from 'keyv-anyredis';
import { ScheduleModule } from '@nestjs/schedule';
import helmet from 'helmet';
import { AllExceptionFilter } from '@/filters/all-exception.filter';
import cookieConfig from './config/cookie.config';
import sqlConfig from './config/sql.config';
import redisConfig from './config/redis.config';
import appConfig from './config/app.config';
import { KyselyModule } from 'nestjs-kysely';
import { MysqlDialect } from 'kysely';
import { DATABASE_POOL } from './postgres/constants/postgres.constants';
import { InstallationCheckMiddleware } from './middleware/installation-check.middleware';
import { InstallerModule } from './modules/installer/installer.module';
import { BetterAuthModule } from './modules/betterauth/betterauth.module';
import { BetterAuthService } from './modules/betterauth/services/betterauth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [
        registerAs('app', () => appConfig),
        registerAs('cookie', () => cookieConfig),
        registerAs('sql', () => sqlConfig), 
        registerAs('redis', () => redisConfig),
      ],
    }),
    LoggerModule.forRoot(),
    EventEmitterModule.forRoot(),
    RedisModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService, redisClient: Redis) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvAnyRedis(redisClient),
            }),
          ],
        };
      },
      inject: [ConfigService, REDIS_CLIENT],
      isGlobal: true,
    }),
    PostgresModule,
    ScheduleModule.forRoot(),
    KyselyModule.forRootAsync({
      imports: [PostgresModule],
      inject: [DATABASE_POOL],
      useFactory: (postgresPool: any) => ({
        dialect: new MysqlDialect({
          pool: postgresPool,
        }),
      }),
    }),
    BetterAuthModule,
    InstallerModule,
    AuthModule.forRootAsync({
      imports: [BetterAuthModule],
      useFactory: (betterAuthService: BetterAuthService) => {
        return {
          auth: betterAuthService,
        };
      },
      inject: [BetterAuthService],
    }),
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
    InstallationCheckMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(helmet()).forRoutes('*');
    consumer.apply(InstallationCheckMiddleware).forRoutes('*');
  }
}
