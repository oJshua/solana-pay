import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSession } from 'src/entities/payment-session.entity';
import { PaymentsController } from './payments/payments.controller';
import { OnboardingController } from './onboarding/onboarding.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentSession]), ConfigModule],
  controllers: [PaymentsController, OnboardingController],
})
export class ShopifyModule {}
