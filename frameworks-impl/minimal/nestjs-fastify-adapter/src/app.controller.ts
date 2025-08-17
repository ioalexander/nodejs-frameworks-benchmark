import { Controller, Get, Body, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('hello')
  getHello() {
    return { message: 'Hello from NestJS!' };
  }

  @Post('post-parse-and-return')
  postParseAndReturn(@Body() body: any) {
    let sum = 0;
    if (body && Array.isArray(body.numbers)) {
      for (let i = 0; i < body.numbers.length; i++) {
        sum += Math.sqrt(body.numbers[i]); // tiny CPU work
      }
    }

    const memBlob = body && body.name ? body.name.repeat(100) : '';

    return {
      original: body,
      sum,
      memBlobLength: memBlob.length,
      timestamp: Date.now(),
    };
  }
}
