import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSession } from 'src/entities/payment-session.entity';
import { SecurityModule } from 'src/security/security.module';
import { ServicesModule } from 'src/services/services.module';
import { PaymentSessionController } from './payment-session.controller';

@Module({
  controllers: [PaymentSessionController],
  imports: [
    TypeOrmModule.forFeature([PaymentSession]),
    SecurityModule,
    ServicesModule
  ]
})
export class PaymentSessionModule {}
