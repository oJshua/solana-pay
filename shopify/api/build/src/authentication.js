"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const KeystoreService_1 = require("./services/KeystoreService");
function expressAuthentication(request, securityName, scopes) {
    console.log(scopes);
    if (!("x-access-token" in request.headers)) {
        return Promise.reject({});
    }
    let token = request.headers["x-access-token"];
    if (Array.isArray(token)) {
        token = token[0];
    }
    try {
        const decoded = (0, KeystoreService_1.decodeJWT)(token);
        console.log(scopes);
        for (let scope of scopes) {
            if (decoded.scope !== scope) {
                return Promise.reject(new Error("JWT does not contain required scope."));
            }
        }
        return Promise.resolve(decoded);
    }
    catch (error) {
        return Promise.reject({});
    }
}
exports.expressAuthentication = expressAuthentication;
