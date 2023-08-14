import { HttpException, Injectable } from '@nestjs/common';

export interface IResponse {
  message: string;
}
@Injectable()
export class BaseError {
  statusCode: number;
  data: any;
  message: string;

  constructor({ message }: IResponse) {
    this.statusCode = 400;
    this.data = '';
    this.message = message;
  }

  error() {
    return new HttpException(
      {
        statusCode: this.statusCode,
        data: this.data,
        message: this.message,
      },
      400,
    );
  }
}
