import { Get } from "@tsoa/runtime";
import { Query } from "@tsoa/runtime";
import { Route } from "@tsoa/runtime";
import { Controller } from "@tsoa/runtime";
import { Body, Post, Res, TsoaResponse } from "tsoa";
import { Inject } from "typescript-ioc";
import {
  PaymentSession,
  PaymentSessionRepository,
} from "../entities/PaymentSession";
import { InitiatePaymentDto } from "../interfaces/InitiatePaymentDto";
import { RedirectUrl } from "../interfaces/RedirectUrl";
import { KeystoreService } from "../services/KeystoreService";
import { v4 } from "uuid";

@Route("payment-session")
export class PaymentSessionController extends Controller {
  @Inject
  keystore: KeystoreService;

  @Inject
  paymentSessionRepository: PaymentSessionRepository;

  @Get()
  async getPaymentSession(
    @Query() paymentSessionId: string,
    @Res() notFoundResponse: TsoaResponse<404, string>
  ): Promise<string> {
    const paymentSession = await this.paymentSessionRepository.findOne({
      paymentSessionId,
    });

    if (!paymentSession) {
      return notFoundResponse(404, "Payment session not found.");
    }

    const token = await this.keystore.getJwt({
      scope: 'payment',
      paymentSessionId,
      paymentInformation: paymentSession.paymentInformation,
      paymentUrl: PaymentSession.encodeBip(paymentSession),
    });

    return token;
  }

  @Post("initiate")
  async initiatePayment(
    @Body() body: InitiatePaymentDto
  ): Promise<RedirectUrl> {
    const paymentSessionId = v4();

    await this.paymentSessionRepository.create({
      paymentSessionId,
      integration: "shopify",
      meta: body,
    });

    return {
      redirect_url: this.getRedirectUrl(paymentSessionId),
    };
  }

  @Post("refund")
  async refund() {
    return true;
  }

  getRedirectUrl(paymentSessionId: string) {
    return `${process.env.FRONTEND_URL}?paymentSessionId=${paymentSessionId}`;
  }
}
