import {
  Body,
  Controller,
  InternalServerErrorException,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { PaymentService } from '../payments/payment.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  ORDERS_EXCHANGE,
  ORDERS_PROCESSED_Q,
  ORDERS_PROCESSED_Q_PATTERN,
} from 'src/util/constaints';

@Controller()
export class PaymentController implements OnModuleInit {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly amqp: AmqpConnection,
  ) {}

  onModuleInit() {
    this.paymentService.connectStripe();
  }

  @Post('/api/payments/charge')
  async createCharge(
    @Body('orderId') orderId: number,
    @Body('amount') amount: number,
    @Body('ticketId') ticketId: string,
    @Body('source') source: string,
  ) {
    const didCharge = await this.paymentService.createCharge(amount, source);
    if (!didCharge) {
      throw new InternalServerErrorException();
    }
    const result = await this.paymentService.insertPayment(orderId, ticketId);
    if (!result) {
      throw new InternalServerErrorException();
    }
    this.amqp.publish(ORDERS_EXCHANGE, ORDERS_PROCESSED_Q_PATTERN, didCharge);
    return {
      response: {
        result: result,
        paymendId: this.paymentService.paymentId,
      },
    };
  }
}
