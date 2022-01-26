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
exports.TestController = void 0;
const tsoa_1 = require("tsoa");
const typescript_ioc_1 = require("typescript-ioc");
const PaymentSession_1 = require("../entities/PaymentSession");
const uuid_1 = require("uuid");
const web3_js_1 = require("@solana/web3.js");
const OnboardSession_1 = require("../entities/OnboardSession");
const RedisService_1 = require("../services/RedisService");
const REDIS_SET = 'references';
let TestController = class TestController {
    async initiate(req) {
        const paymentSessionId = (0, uuid_1.v4)();
        const reference = web3_js_1.Keypair.generate().publicKey.toString();
        await this.redisService.redis.sadd(REDIS_SET, reference);
        const result = await this.paymentSessionRepository.insert({
            paymentSessionId,
            integration: "test",
            meta: {},
            reference,
            paymentInformation: {
                recipient: "8HHPdNSLhTTsiYnMVBNp6myH37VQjJQh2ZVNQ5Fpdd4B",
                reference,
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
        return req.res.redirect(this.getRedirectUrl(paymentSessionId));
    }
    async onboard(req) {
        const onboardSessionId = (0, uuid_1.v4)();
        const result = await this.onboardSessionRepository.insert({
            onboardSessionId,
            shop: 'test-shop'
        });
        return req.res.redirect(`${process.env.FRONTEND_URL}?onboardSessionId=${onboardSessionId}`);
    }
    getRedirectUrl(paymentSessionId) {
        return `${process.env.FRONTEND_URL}?paymentSessionId=${paymentSessionId}`;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", PaymentSession_1.PaymentSessionRepository)
], TestController.prototype, "paymentSessionRepository", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", OnboardSession_1.OnboardSessionRepository)
], TestController.prototype, "onboardSessionRepository", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", RedisService_1.RedisService)
], TestController.prototype, "redisService", void 0);
__decorate([
    (0, tsoa_1.Get)("initiate"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "initiate", null);
__decorate([
    (0, tsoa_1.Get)("onboard"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "onboard", null);
TestController = __decorate([
    (0, tsoa_1.Route)("test")
], TestController);
exports.TestController = TestController;
