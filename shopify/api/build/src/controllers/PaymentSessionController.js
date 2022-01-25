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
const KeystoreService_1 = require("../services/KeystoreService");
const uuid_1 = require("uuid");
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
        });
        return token;
    }
    async initiatePayment(body) {
        const paymentSessionId = (0, uuid_1.v4)();
        await this.paymentSessionRepository.create({
            paymentSessionId,
            integration: "shopify",
            meta: body,
        });
        return {
            redirect_url: this.getRedirectUrl(paymentSessionId),
        };
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
    __metadata("design:type", PaymentSession_1.PaymentSessionRepository)
], PaymentSessionController.prototype, "paymentSessionRepository", void 0);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
