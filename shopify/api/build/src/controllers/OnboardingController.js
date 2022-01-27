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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingController = void 0;
const tsoa_1 = require("tsoa");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const shopify_hmac_validation_1 = require("shopify-hmac-validation");
const OnboardRequest_1 = require("../entities/OnboardRequest");
const typescript_ioc_1 = require("typescript-ioc");
const uuid_1 = require("uuid");
const Merchant_1 = require("../entities/Merchant");
const KeystoreService_1 = require("../services/KeystoreService");
const OnboardSession_1 = require("../entities/OnboardSession");
let OnboardingController = class OnboardingController extends tsoa_1.Controller {
    async install(shop, req, invalidRequest) {
        const state = (0, uuid_1.v4)();
        if (!(0, shopify_hmac_validation_1.checkHmacValidity)(process.env.SHOPIFY_API_SECRET, req.query)) {
            return invalidRequest(500, "Invalid hmac");
        }
        await this.onboardRequestRepository.insert({
            shop,
            state,
        });
        return req.res.redirect(this.getShopifyUrl(shop, state));
    }
    async redirect(shop, state, code, req, invalidRequest) {
        const request = await this.onboardRequestRepository.findOne({
            where: {
                shop,
                state,
            },
        });
        if (!request) {
            return invalidRequest(500, "Invalid shop or nonce");
        }
        if (!(0, shopify_hmac_validation_1.checkHmacValidity)(process.env.SHOPIFY_API_SECRET, req.query)) {
            return invalidRequest(500, "Invalid hmac");
        }
        if (!shop.match(/[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com/)) {
            return invalidRequest(500, "Invalid shop");
        }
        const result = await (0, cross_fetch_1.default)(`https://${shop}/admin/oauth/access_token`, {
            method: "POST",
            body: JSON.stringify({
                client_id: process.env.SHOPIFY_API_KEY,
                client_secret: process.env.SHOPIFY_API_SECRET,
                code,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { access_token } = await result.json();
        await this.merchantRepository.findOneAndUpdate({
            shop,
        }, {
            $set: {
                shop,
                access_token,
            },
        }, {
            upsert: true,
        });
        const onboardSessionId = (0, uuid_1.v4)();
        await this.onboardSessionRepository.insert({
            shop,
            onboardSessionId,
        });
        const ql = await (0, cross_fetch_1.default)(`https://${shop}/payments_apps/api/2021-10/graphql.json`, {
            method: "POST",
            body: JSON.stringify({
                query: `
          mutation PaymentsAppConfigure($externalHandle: String, $ready: Boolean!) {
            paymentsAppConfigure(externalHandle: $externalHandle, ready: $ready) {
                userErrors{
                    field
                    message
                }
            }
          }`,
                variables: {
                    externalHandle: "Test Handle",
                    ready: true,
                },
            }),
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": access_token,
            },
        });
        req.res.redirect(`${process.env.FRONTEND_URL}?onboardSessionId=${onboardSessionId}`);
    }
    async getSession(onboardSessionId, notFoundResponse) {
        const onboardSession = await this.onboardSessionRepository.findOne({
            onboardSessionId
        });
        const token = await this.keystore.getJwt({
            scope: 'onboarding',
            shop: onboardSession.shop
        });
        return token;
    }
    async saveWallet({ wallet }, req) {
        const { shop } = req.user;
        // validate wallet
        await this.merchantRepository.findOneAndUpdate({
            shop,
        }, {
            $set: {
                shop,
                wallet,
            },
        });
    }
    getShopifyUrl(shop, state) {
        let url = `https://${shop}/admin/oauth/authorize?`;
        url += `client_id=${process.env.SHOPIFY_API_KEY}`;
        url += `&scope=write_payment_gateways,write_payment_sessions`;
        url += `&redirect_uri=${process.env.BACKEND_URL}/onboarding/redirect`;
        url += `&state=${state}`;
        url += `&grant_options[]=value`;
        return url;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", OnboardRequest_1.OnboardRequestRepository)
], OnboardingController.prototype, "onboardRequestRepository", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", Merchant_1.MerchantRepository)
], OnboardingController.prototype, "merchantRepository", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", OnboardSession_1.OnboardSessionRepository)
], OnboardingController.prototype, "onboardSessionRepository", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", KeystoreService_1.KeystoreService)
], OnboardingController.prototype, "keystore", void 0);
__decorate([
    (0, tsoa_1.Get)("install"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "install", null);
__decorate([
    (0, tsoa_1.Get)("redirect"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Request)()),
    __param(4, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Function]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "redirect", null);
__decorate([
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "getSession", null);
__decorate([
    (0, tsoa_1.Post)("wallet"),
    (0, tsoa_1.Security)("api_key", ["onboarding"]),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "saveWallet", null);
OnboardingController = __decorate([
    (0, tsoa_1.Route)("onboarding")
], OnboardingController);
exports.OnboardingController = OnboardingController;
