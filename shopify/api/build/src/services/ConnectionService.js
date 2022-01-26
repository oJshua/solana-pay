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
exports.ConnectionService = void 0;
const web3_js_1 = require("@solana/web3.js");
const typescript_ioc_1 = require("typescript-ioc");
let ConnectionService = class ConnectionService {
    constructor() {
        this.connection = new web3_js_1.Connection(process.env.API_ENDPOINT || 'http://localhost:8899');
    }
};
ConnectionService = __decorate([
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [])
], ConnectionService);
exports.ConnectionService = ConnectionService;
