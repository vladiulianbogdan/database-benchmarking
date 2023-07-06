"use strict";
/**
* This is an auto generated code. This code should not be modified since the file can be overwriten
* if new genezio commands are executed.
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remote = void 0;
let http = null;
let https = null;
let importDone = false;
function importModules() {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof process !== "undefined" && process.versions != null && process.versions.node != null) {
            const httpModule = 'http';
            http = yield Promise.resolve(`${httpModule}`).then(s => __importStar(require(s)));
            const httpsModule = 'https';
            https = yield Promise.resolve(`${httpsModule}`).then(s => __importStar(require(s)));
        }
        importDone = true;
    });
}
function makeRequestBrowser(request, url) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const response = yield fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request),
        });
        return response.json();
    });
}
function makeRequestNode(request, url, agent) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = JSON.stringify(request);
        const hostUrl = new URL(url);
        const options = {
            hostname: hostUrl.hostname,
            path: hostUrl.search ? hostUrl.pathname + hostUrl.search : hostUrl.pathname,
            port: hostUrl.port,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
            agent: agent,
        };
        const client = url.includes('https') ? https : http;
        return new Promise((resolve, reject) => {
            const req = client.request(options, (res) => {
                let body = '';
                res.on('data', (d) => {
                    body += d;
                });
                res.on('end', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const response = JSON.parse(body);
                        resolve(response);
                    });
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(data);
            req.end();
        });
    });
}
/**
 * The class through which all request to the Genezio backend will be passed.
 *
 */
class Remote {
    constructor(url) {
        this.url = undefined;
        this.agent = undefined;
        this.url = url;
        if (http !== null && https !== null) {
            const client = url.includes("https") ? https : http;
            this.agent = new client.Agent({ keepAlive: true });
        }
    }
    call(method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestContent = { "jsonrpc": "2.0", "method": method, "params": args, "id": 3 };
            let response = undefined;
            if (!importDone) {
                yield importModules();
            }
            if (http !== null && https !== null) {
                response = yield makeRequestNode(requestContent, this.url, this.agent);
            }
            else {
                response = yield makeRequestBrowser(requestContent, this.url);
            }
            if (response.error) {
                return response.error.message;
            }
            return response.result;
        });
    }
}
exports.Remote = Remote;
