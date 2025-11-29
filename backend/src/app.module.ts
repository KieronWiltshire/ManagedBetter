import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
    InstallerModule,
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
    consumer.apply(helmet()).forRoutes('*');
    consumer.apply(InstallationCheckMiddleware).forRoutes('*');
  }
}
