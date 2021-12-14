import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePaymentSessionDto } from 'src/payment-session/dto/create-payment-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { PaymentSession } from 'src/entities/payment-session.entity';
import BigNumber from 'bignumber.js';
import { KeystoreService } from 'src/security/keystore/keystore.service';
import { GetPaymentSessionDto } from 'src/payment-session/dto/get-payment-session.dto';
import { ConnectionService } from 'src/services/connection/connection.service';
import { findTransactionSignature } from '@solana/pay';
import { PublicKey } from '@solana/web3.js';

@Controller('payment-session')
export class PaymentSessionController {
  constructor(
    private keystore: KeystoreService,
    private connectionService: ConnectionService,
    @InjectRepository(PaymentSession)
    private paymentSessionRepository: Repository<PaymentSession>,
  ) {}

  @Post()
  async createPaymentSession(@Body() create: CreatePaymentSessionDto) {
    const paymentSessionId = v4();

    const { recipient, amount, label } = create;

    await this.paymentSessionRepository.insert({
      paymentSessionId,
      paymentInformation: {
        recipient,
        amount: new BigNumber(amount),
        label,
      },
    });

    return { paymentSessionId };
  }

  @Get()
  async getPaymentSession(@Query() { paymentSessionId }: GetPaymentSessionDto) {
    const paymentSession = await this.paymentSessionRepository.findOne({
      paymentSessionId,
    });

    if (!paymentSession) {
      throw new HttpException('Payment session not found', 404);
    }

    const token = await this.keystore.getJwt({
      paymentSessionId,
      paymentInformation: paymentSession.paymentInformation,
      paymentUrl: PaymentSession.encodeBip(paymentSession),
    });

    return token;
  }

  @Get('/check')
  async checkPaymentSession(
    @Query() { paymentSessionId }: GetPaymentSessionDto,
  ) {
    const paymentSession = await this.paymentSessionRepository.findOne({
      paymentSessionId,
    });

    if (!paymentSession) {
      throw new HttpException('Payment session not found', 404);
    }

    try {
      let signature = await findTransactionSignature(
        this.connectionService.connection,
        new PublicKey(paymentSession.paymentInformation.reference),
      );

      return signature;
    } catch (error) {
      return null;
    }
  }
}
