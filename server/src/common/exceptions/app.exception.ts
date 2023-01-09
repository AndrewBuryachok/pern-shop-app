import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(error: string) {
    const [status, response] = error.split(': ', 2);
    super(response, +status);
  }
}
