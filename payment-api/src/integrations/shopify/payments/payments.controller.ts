import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentSession } from 'src/entities/payment-session.entity';
import { InitiatePaymentDto } from 'src/integrations/shopify/dto/initiate-payment.dto';
import { InitiateRefundDto } from 'src/integrations/shopify/dto/intiate-refund.dto';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

interface RedirectUrl {
  redirect_url: string;
}

@Controller('integrations/shopify/payments')
export class PaymentsController {
  constructor(
    @InjectRepository(PaymentSession)
    private paymentSessionRepository: Repository<PaymentSession>,
    private configService: ConfigService,
  ) {}

  @Post('initiate')
  async initiatePayment(
    @Body() body: InitiatePaymentDto,
  ): Promise<RedirectUrl> {
    const paymentSessionId = v4();

    await this.paymentSessionRepository.create({
      paymentSessionId,
      integration: 'shopify',
      meta: body,
    });

    return {
      redirect_url: this.getRedirectUrl(paymentSessionId),
    };
  }

  @Post('refund')
  async initiateRefund(
    @Res() res,
    @Body() body: InitiateRefundDto
  ) {
    return res.code(201);
  }

  getRedirectUrl(paymentSessionId: string) {
    return `${this.configService.get<string>(
      'FRONTEND_URL',
    )}?paymentSessionId=${paymentSessionId}`;
  }
}
