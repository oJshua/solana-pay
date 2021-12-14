import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ShopifyModule } from './integrations/shopify/shopify.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSession } from 'src/entities/payment-session.entity';
import { TestModule } from './integrations/test/test.module';
import { SecurityModule } from './security/security.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { PaymentSessionModule } from './payment-session/payment-session.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.MONGO_HOST || 'localhost',
      port: parseInt(process.env.MONGO_PORT) || 27017,
      database: process.env.MONGO_DATABASE || 'payments',
      entities: [PaymentSession],
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
    }),
    ShopifyModule,
    TestModule,
    SecurityModule,
    ServicesModule,
    AuthModule,
    PaymentSessionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
