import { HttpException, HttpStatus } from '@nestjs/common';

export class NotInstalledException extends HttpException {
  constructor() {
    super({ message: 'The application has not been installed yet.' }, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

