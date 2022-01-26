"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.self = this; // Hack for @solana/pay qr-code-styling
require("reflect-metadata");
require("dotenv").config();
const typeorm_1 = require("typeorm");
const typescript_ioc_1 = require("typescript-ioc");
const app_1 = require("./app");
const Merchant_1 = require("./entities/Merchant");
const OnboardRequest_1 = require("./entities/OnboardRequest");
const OnboardSession_1 = require("./entities/OnboardSession");
const PaymentSession_1 = require("./entities/PaymentSession");
const ReferenceService_1 = require("./services/ReferenceService");
const port = process.env.PORT || 3000;
(async () => {
    const connection = await (0, typeorm_1.createConnection)({
        type: "mongodb",
        host: process.env.MONGO_HOST || "localhost",
        port: process.env.MONGO_PORT ? parseInt(process.env.MONGO_PORT) : 27017,
        database: process.env.MONGO_DATABASE || "payments",
        entities: [PaymentSession_1.PaymentSession, OnboardRequest_1.OnboardRequest, Merchant_1.Merchant, OnboardSession_1.OnboardSession],
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
    });
    const referenceService = typescript_ioc_1.Container.get(ReferenceService_1.ReferenceService);
    referenceService.start();
    typescript_ioc_1.Container.bind(PaymentSession_1.PaymentSessionRepository).factory(() => (0, typeorm_1.getMongoRepository)(PaymentSession_1.PaymentSession));
    typescript_ioc_1.Container.bind(OnboardRequest_1.OnboardRequestRepository).factory(() => (0, typeorm_1.getMongoRepository)(OnboardRequest_1.OnboardRequest));
    typescript_ioc_1.Container.bind(OnboardSession_1.OnboardSessionRepository).factory(() => (0, typeorm_1.getMongoRepository)(OnboardSession_1.OnboardSession));
    typescript_ioc_1.Container.bind(Merchant_1.MerchantRepository).factory(() => (0, typeorm_1.getMongoRepository)(Merchant_1.Merchant));
    app_1.app.listen(port, () => console.log(`Shopify integration app listening at http://localhost:${port}`));
})();
