import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Keypair } from '@solana/web3.js';
import { PaymentSession } from 'src/entities/payment-session.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Controller('integrations/test/payments')
export class PaymentsController {
  constructor(
    @InjectRepository(PaymentSession)
    private paymentSessionRepository: Repository<PaymentSession>,
    private configService: ConfigService,
  ) {}

  @Get('initiate')
  async initiatePaymentFlow(@Res() res): Promise<PaymentSession[]> {
    const paymentSessionId = v4();

    const result = await this.paymentSessionRepository.insert({
      paymentSessionId,
      integration: 'test',
      meta: {},
      paymentInformation: {
        recipient: '8HHPdNSLhTTsiYnMVBNp6myH37VQjJQh2ZVNQ5Fpdd4B',
        reference: Keypair.generate().publicKey.toString(),
        paymentOptions: [
          {
            amount: 0.001,
          },
          // {
          //   amount: 200,
          //   tokenSymbol: 'USDC',
          //   tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          // },
        ],
      },
    });

    return res.redirect(this.getRedirectUrl(paymentSessionId));
  }

  getRedirectUrl(paymentSessionId: string) {
    return `${this.configService.get<string>(
      'FRONTEND_URL',
    )}?paymentSessionId=${paymentSessionId}`;
  }
}
