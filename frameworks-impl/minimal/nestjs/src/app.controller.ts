import { Controller, Get, Body, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('hello')
  getHello() {
    return { message: 'Hello from NestJS!' };
  }

  @Post('post-parse-and-return')
  postParseAndReturn(@Body() body: any) {
    return body;
  }
}
