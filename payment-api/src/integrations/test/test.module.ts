import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSession } from 'src/entities/payment-session.entity';
import { ServicesModule } from 'src/services/services.module';
import { PaymentsController } from './payments/payments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentSession]),
    ConfigModule,
    ServicesModule,
  ],
  controllers: [PaymentsController],
})
export class TestModule {}
