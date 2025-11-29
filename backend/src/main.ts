import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const logger = app.get<Logger>(Logger);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  if (config.get<boolean>('app.debug')) {
    app.getHttpAdapter().getInstance().set('json spaces', 2);
  } else {
    app.useLogger(logger);
  }

  const appName = config.get<string>('app.name');
  const appDomain = config.get<string>('app.domain');
  const appPort = config.get<number>('app.port')!;
  
  await app.listen(appPort);

  logger.log(`${appName} is running on: http://${appDomain}:${appPort}`);
}
bootstrap();
