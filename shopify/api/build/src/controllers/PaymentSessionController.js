"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSessionController = void 0;
const runtime_1 = require("@tsoa/runtime");
const runtime_2 = require("@tsoa/runtime");
const runtime_3 = require("@tsoa/runtime");
const runtime_4 = require("@tsoa/runtime");
const tsoa_1 = require("tsoa");
const typescript_ioc_1 = require("typescript-ioc");
const PaymentSession_1 = require("../entities/PaymentSession");
const shopify_hmac_validation_1 = require("shopify-hmac-validation");
const KeystoreService_1 = require("../services/KeystoreService");
const uuid_1 = require("uuid");
const Merchant_1 = require("../entities/Merchant");
const web3_js_1 = require("@solana/web3.js");
const RedisService_1 = require("../services/RedisService");
const REDIS_SET = 'references';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
let PaymentSessionController = class PaymentSessionController extends runtime_4.Controller {
    async getPaymentSession(paymentSessionId, notFoundResponse) {
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
            paymentUrl: PaymentSession_1.PaymentSession.encodeBip(paymentSession),
            cancelUrl: paymentSession.cancelUrl
        });
        return token;
    }
    async initiatePayment(body, req, invalidRequest) {
        const paymentSessionId = (0, uuid_1.v4)();
        if (!(0, shopify_hmac_validation_1.checkHmacValidity)(process.env.SHOPIFY_API_SECRET, req.query)) {
            return invalidRequest(500, "Invalid hmac");
        }
        const reference = web3_js_1.Keypair.generate().publicKey.toString();
        const { shop } = req.query;
        const { cancel_url } = body;
        const merchant = await this.merchantRepository.findOne({
            shop
        });
        await this.redisService.redis.sadd(REDIS_SET, reference);
        await this.paymentSessionRepository.create({
            paymentSessionId,
            integration: "shopify",
            meta: body,
            shop,
            reference,
            cancelUrl: cancel_url,
            paymentInformation: {
                amount: body.amount,
                recipient: merchant.wallet,
                reference,
                paymentOptions: [{
                        amount: body.amount,
                        tokenSymbol: 'USDC',
                        tokenMint: USDC_MINT,
                    }]
            }
        });
        return {
            redirect_url: this.getRedirectUrl(paymentSessionId),
        };
    }
    async complete() {
    }
    async refund() {
        return true;
    }
    getRedirectUrl(paymentSessionId) {
        return `${process.env.FRONTEND_URL}?paymentSessionId=${paymentSessionId}`;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", KeystoreService_1.KeystoreService)
], PaymentSessionController.prototype, "keystore", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", RedisService_1.RedisService)
], PaymentSessionController.prototype, "redisService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", PaymentSession_1.PaymentSessionRepository)
], PaymentSessionController.prototype, "paymentSessionRepository", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", Merchant_1.MerchantRepository)
], PaymentSessionController.prototype, "merchantRepository", void 0);
__decorate([
    (0, runtime_1.Get)(),
    __param(0, (0, runtime_2.Query)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], PaymentSessionController.prototype, "getPaymentSession", null);
__decorate([
    (0, tsoa_1.Post)("initiate"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, runtime_1.Request)()),
    __param(2, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PaymentSessionController.prototype, "initiatePayment", null);
__decorate([
    (0, tsoa_1.Post)("refund"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentSessionController.prototype, "refund", null);
PaymentSessionController = __decorate([
    (0, runtime_3.Route)("payment-session")
], PaymentSessionController);
exports.PaymentSessionController = PaymentSessionController;
