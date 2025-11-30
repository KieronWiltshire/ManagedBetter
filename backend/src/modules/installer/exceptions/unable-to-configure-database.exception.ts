import { HttpException, HttpStatus } from '@nestjs/common';

export class UnableToConfigureDatabaseException extends HttpException {
  constructor() {
    super({ message: 'Unable to configure the database.' }, HttpStatus.EXPECTATION_FAILED);
  }
}

