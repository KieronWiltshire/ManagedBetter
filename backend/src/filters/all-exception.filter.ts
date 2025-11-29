import {
    Catch,
    ArgumentsHost,
    HttpException,
    Injectable,
    Inject,
    Logger,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { ConfigService } from '@nestjs/config';
  import { BaseExceptionFilter } from '@nestjs/core';
  
  @Injectable()
  @Catch()
  export class AllExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);
  
    public constructor(
      @Inject(ConfigService) private readonly config: ConfigService,
    ) {
      super();
    }
  
    catch(exception: unknown, host: ArgumentsHost) {
      this.logger.error(exception);
  
      if (exception instanceof HttpException) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const { message, error, statusCode, ...meta } = exception.getResponse() as any;

        const payload: any = {
          type: exception.name.replace(/exception/gi, ''),
          message: exception.message,
        };

        if (Object.keys(meta).length > 0) {
          payload.meta = meta;
        }

        if (this.config.get<boolean>('app.debug')) {
          payload.stackTrace = exception.stack;
        }

        response.status(status).json(payload);
      } else {
        super.catch(exception, host);
      }
    }
  }