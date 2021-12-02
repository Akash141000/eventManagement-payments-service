import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/api/payments/charge")
  async createCharge(@Body("amount") amount:number,@Body("currency")currency:string,@Body("source")source:string,@Body("description")description:string) {
  return await this.appService.createCharge(amount,currency,source,description);

  }
}
