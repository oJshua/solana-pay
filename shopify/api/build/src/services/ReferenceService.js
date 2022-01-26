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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceService = void 0;
const pay_1 = require("@solana/pay");
const web3_js_1 = require("@solana/web3.js");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const typescript_ioc_1 = require("typescript-ioc");
const Merchant_1 = require("../entities/Merchant");
const PaymentSession_1 = require("../entities/PaymentSession");
const ConnectionService_1 = require("./ConnectionService");
const RedisService_1 = require("./RedisService");
const POLL_INTERVAL = 10000;
const REDIS_SET = "references";
let ReferenceService = class ReferenceService {
    async completePayment(reference, payment) {
        const merchant = await this.merchantSessionRepository.findOne({
            shop: payment.shop,
        });
        if (payment.integration === "shopify") {
            const ql = await (0, cross_fetch_1.default)(`https://${payment.shop}/payments_apps/api/2021-10/graphql.json`, {
                method: "POST",
                body: JSON.stringify({
                    query: `
          mutation PaymentSessionResolve($id: ID!) {
            paymentSessionResolve(id: $id) {
              paymentSession {
                id
                status {
                  code
                }
                nextAction {
                  action
                  context {
                    ... on PaymentSessionActionsRedirect {
                      redirectUrl
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }`,
                    variables: {
                        id: payment.meta.id,
                    },
                }),
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": merchant.access_token,
                },
            });
            const res = await ql.json();
            await this.paymentSessionRepository.findOneAndUpdate({
                reference,
            }, {
                $set: {
                    completed: true,
                    redirectUrl: res.data.paymentSessionResolve.paymentSession.nextAction.context
                        .redirectUrl,
                },
            });
        }
        else {
            await this.paymentSessionRepository.findOneAndUpdate({
                reference,
            }, {
                $set: {
                    completed: true,
                },
            });
        }
        await this.redisService.redis.srem(REDIS_SET, reference);
    }
    start() {
        this.interval = setInterval(async () => {
            try {
                let references = await this.redisService.redis.smembers(REDIS_SET);
                for (let reference of references) {
                    const session = await this.paymentSessionRepository.findOne({
                        reference,
                    });
                    try {
                        const signature = await (0, pay_1.findTransactionSignature)(this.connectionService.connection, new web3_js_1.PublicKey(reference));
                        const response = await (0, pay_1.validateTransactionSignature)(this.connectionService.connection, signature.signature, new web3_js_1.PublicKey(session.paymentInformation.recipient), new bignumber_js_1.default(session.paymentInformation.amount), session.paymentInformation.paymentOptions[0].tokenMint
                            ? new web3_js_1.PublicKey(session.paymentInformation.paymentOptions[0].tokenMint)
                            : undefined, new web3_js_1.PublicKey(reference));
                        this.completePayment(reference, session);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }, POLL_INTERVAL);
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", RedisService_1.RedisService)
], ReferenceService.prototype, "redisService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", ConnectionService_1.ConnectionService)
], ReferenceService.prototype, "connectionService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", PaymentSession_1.PaymentSessionRepository)
], ReferenceService.prototype, "paymentSessionRepository", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", Merchant_1.MerchantRepository)
], ReferenceService.prototype, "merchantSessionRepository", void 0);
ReferenceService = __decorate([
    typescript_ioc_1.Singleton
], ReferenceService);
exports.ReferenceService = ReferenceService;
