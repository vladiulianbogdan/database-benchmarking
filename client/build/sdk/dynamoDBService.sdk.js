"use strict";
/**
* This is an auto generated code. This code should not be modified since the file can be overwriten
* if new genezio commands are executed.
*/
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
exports.Remote = exports.DynamoDBService = void 0;
const remote_1 = require("./remote");
Object.defineProperty(exports, "Remote", { enumerable: true, get: function () { return remote_1.Remote; } });
class DynamoDBService {
    static populateWithData(numTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DynamoDBService.remote.call("DynamoDBService.populateWithData", numTasks);
        });
    }
    static makeQuery(sleepTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DynamoDBService.remote.call("DynamoDBService.makeQuery", sleepTime);
        });
    }
}
exports.DynamoDBService = DynamoDBService;
DynamoDBService.remote = new remote_1.Remote("https://gem8024kp1.execute-api.eu-central-1.amazonaws.com/prod//DynamoDBService");
