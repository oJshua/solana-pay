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
exports.SecurityController = void 0;
const runtime_1 = require("@tsoa/runtime");
const typescript_ioc_1 = require("typescript-ioc");
const KeystoreService_1 = require("../services/KeystoreService");
let SecurityController = class SecurityController {
    getJwks() {
        return this.keystoreService.getJwks();
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", KeystoreService_1.KeystoreService)
], SecurityController.prototype, "keystoreService", void 0);
__decorate([
    (0, runtime_1.Get)('/jwks.json'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getJwks", null);
SecurityController = __decorate([
    (0, runtime_1.Route)('security')
], SecurityController);
exports.SecurityController = SecurityController;
