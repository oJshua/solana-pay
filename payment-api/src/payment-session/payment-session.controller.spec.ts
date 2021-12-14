import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSessionController } from './payment-session.controller';

describe('PaymentSessionController', () => {
  let controller: PaymentSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentSessionController],
    }).compile();

    controller = module.get<PaymentSessionController>(PaymentSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
