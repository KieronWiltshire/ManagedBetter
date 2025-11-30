import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyInstalledException extends HttpException {
  constructor() {
    super({ message: 'The application has not been installed yet.' }, HttpStatus.BAD_REQUEST);
  }
}

