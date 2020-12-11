import {
  All,
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
// @UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  async redirectRequest(@Req() request: Request, @Res() response: Response) {
    try {
      console.log(request.originalUrl);
      console.log(request.method);
      console.log(request.body);
      const result = await this.appService.redirectRequest(
        request.originalUrl,
        request.method,
        request.body,
      );
      return response.status(result.statusCode).json(result.data);
    } catch (err) {
      return response.status(err.response.status).json(err.response.data);
    }
  }
}
