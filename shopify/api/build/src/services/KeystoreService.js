"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = exports.KeystoreService = void 0;
const keypairs = __importStar(require("keypairs"));
const typescript_ioc_1 = require("typescript-ioc");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const EXP = '30m';
let pair;
let publicKey;
keypairs.generate().then((_pair) => {
    pair = _pair;
    publicKey = (0, jwk_to_pem_1.default)(_pair.public);
});
let KeystoreService = class KeystoreService {
    getJwks() {
        return {
            keys: [pair.public],
        };
    }
    getJwt(claims) {
        return keypairs.signJwt({
            jwk: pair.private,
            iss: process.env.FRONTEND_URL,
            exp: EXP,
            claims,
        });
    }
};
KeystoreService = __decorate([
    typescript_ioc_1.Singleton
], KeystoreService);
exports.KeystoreService = KeystoreService;
function decodeJWT(token) {
    return jsonwebtoken_1.default.verify(token, publicKey);
}
exports.decodeJWT = decodeJWT;
