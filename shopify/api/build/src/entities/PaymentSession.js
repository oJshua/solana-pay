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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSessionRepository = exports.PaymentSession = void 0;
const typeorm_1 = require("typeorm");
const pay_1 = require("@solana/pay");
const web3_js_1 = require("@solana/web3.js");
const typescript_ioc_1 = require("typescript-ioc");
let PaymentSession = class PaymentSession {
    static encodeBip(session) {
        return (0, pay_1.encodeURL)({
            recipient: new web3_js_1.PublicKey(session.paymentInformation.recipient),
            amount: session.paymentInformation.amount,
            reference: new web3_js_1.PublicKey(session.paymentInformation.reference),
        });
    }
};
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectID)
], PaymentSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("uuid"),
    __metadata("design:type", String)
], PaymentSession.prototype, "paymentSessionId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentSession.prototype, "integration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], PaymentSession.prototype, "meta", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], PaymentSession.prototype, "paymentInformation", void 0);
PaymentSession = __decorate([
    (0, typeorm_1.Entity)()
], PaymentSession);
exports.PaymentSession = PaymentSession;
let PaymentSessionRepository = class PaymentSessionRepository extends typeorm_1.MongoRepository {
};
PaymentSessionRepository = __decorate([
    typescript_ioc_1.Singleton,
    (0, typeorm_1.EntityRepository)(PaymentSession)
], PaymentSessionRepository);
exports.PaymentSessionRepository = PaymentSessionRepository;
