"use strict";
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
const mongoDBDataApiService_sdk_js_1 = require("./sdk/mongoDBDataApiService.sdk.js");
const mongoDBConnectService_sdk_js_1 = require("./sdk/mongoDBConnectService.sdk.js");
const firestoreService_sdk_js_1 = require("./sdk/firestoreService.sdk.js");
const dynamoDBService_sdk_js_1 = require("./sdk/dynamoDBService.sdk.js");
const child_process_1 = require("child_process");
// This is the delay between requests. You can change this to different values.
// A lower value will put more pressure on the databases.
// A higher value will put less pressure on the databases.
const sleepBetweenQueriesInMs = 100;
// Function to run a command as a promise
function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, { cwd: "../server" }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}
// Benchmark the MongoDB connection
function benchmarkMongoDbConnect(count) {
    return __awaiter(this, void 0, void 0, function* () {
        const coldStartPromises = [];
        const warmTimes = [];
        // Perform cold start queries
        while (coldStartPromises.length < count) {
            yield new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
            const promise = mongoDBConnectService_sdk_js_1.MongoDBConnectService.makeQuery(25000).catch((e) => {
                return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() };
            });
            coldStartPromises.push(promise);
        }
        const coldStartTimes = (yield Promise.all(coldStartPromises))
            .filter((result) => result !== undefined)
            .filter((result) => result.success === true)
            .map((result) => {
            return result.metrics.queryTime;
        });
        // Perform warm queries
        while (warmTimes.length < count) {
            const result = yield mongoDBConnectService_sdk_js_1.MongoDBConnectService.makeQuery(0);
            warmTimes.push(result.metrics.queryTime);
        }
        return { coldStartTimes, warmTimes };
    });
}
// Benchmark the MongoDB Data API
function benchmarkMongoDbDataApi(count) {
    return __awaiter(this, void 0, void 0, function* () {
        const coldStartPromises = [];
        const warmTimes = [];
        // Perform cold start queries
        while (coldStartPromises.length < count) {
            yield new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
            const promise = mongoDBDataApiService_sdk_js_1.MongoDBDataApiService.makeQuery(25000).catch((e) => {
                return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() };
            });
            coldStartPromises.push(promise);
        }
        const coldStartTimes = (yield Promise.all(coldStartPromises))
            .filter((result) => result !== undefined)
            .filter((result) => result.success === true)
            .map((result) => {
            return result.metrics.queryTime;
        });
        // Perform warm queries
        while (warmTimes.length < count) {
            const result = yield mongoDBDataApiService_sdk_js_1.MongoDBDataApiService.makeQuery(0);
            warmTimes.push(result.metrics.queryTime);
        }
        return { coldStartTimes, warmTimes };
    });
}
// Benchmark the DynamoDB
function benchmarkDynamoDB(count) {
    return __awaiter(this, void 0, void 0, function* () {
        const coldStartPromises = [];
        const warmTimes = [];
        // Perform cold start queries
        while (coldStartPromises.length < count) {
            yield new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
            const promise = dynamoDBService_sdk_js_1.DynamoDBService.makeQuery(25000).catch((e) => {
                return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() };
            });
            coldStartPromises.push(promise);
        }
        const coldStartTimes = (yield Promise.all(coldStartPromises))
            .filter((result) => result.success === true)
            .map((result) => result.metrics.queryTime);
        // Perform warm queries
        while (warmTimes.length < count) {
            const result = yield dynamoDBService_sdk_js_1.DynamoDBService.makeQuery(0);
            warmTimes.push(result.metrics.queryTime);
        }
        return { coldStartTimes, warmTimes };
    });
}
// Benchmark the Firebase
function benchmarkFirebase(count) {
    return __awaiter(this, void 0, void 0, function* () {
        const coldStartPromises = [];
        const warmTimes = [];
        // Perform cold start queries
        while (coldStartPromises.length < count) {
            yield new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
            const promise = firestoreService_sdk_js_1.FirestoreService.makeQuery(25000).catch((e) => {
                console.error(e);
                return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() };
            });
            coldStartPromises.push(promise);
        }
        const coldStartTimes = (yield Promise.all(coldStartPromises))
            .filter((result) => result.success === true)
            .map((result) => result.metrics.queryTime);
        // Perform warm queries
        while (warmTimes.length < count) {
            const result = yield firestoreService_sdk_js_1.FirestoreService.makeQuery(0);
            warmTimes.push(result.metrics.queryTime);
        }
        return { coldStartTimes, warmTimes };
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting benchmark...");
    let mongoDbDataApiTimes;
    let firebaseTimes = {
        coldStartTimes: [],
        warmTimes: []
    };
    let mongoDbConnectTimes;
    let dynamodbTimes;
    // The number of AWS Lambda that we want to run in parallel.
    const count = 10;
    // We do a deploy in order to make sure that the functions will have a cold start.
    console.log("Start deploying");
    yield runCommand("genezio deploy --backend");
    console.log("Finished deploying");
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    mongoDbDataApiTimes = yield benchmarkMongoDbDataApi(count);
    firebaseTimes = yield benchmarkFirebase(count);
    mongoDbConnectTimes = yield benchmarkMongoDbConnect(count);
    dynamodbTimes = yield benchmarkDynamoDB(count);
    // Printing the results
    console.log("Benchmarking with ", count, " requests");
    console.log("MongoDB Data API cold, MongoDB Data API warm, Firebase cold, Firebase warm, MongoDB Connect cold, MongoDB Connect warm, DynamoDB cold, DynamoDB warm");
    mongoDbDataApiTimes.coldStartTimes.forEach((item, index) => {
        console.log(`${item}, ${mongoDbDataApiTimes.warmTimes[index]}, ${firebaseTimes.coldStartTimes[index]}, ${firebaseTimes.warmTimes[index]}, ${mongoDbConnectTimes.coldStartTimes[index]}, ${mongoDbConnectTimes.warmTimes[index]}, ${dynamodbTimes.coldStartTimes[index]}, ${dynamodbTimes.warmTimes[index]}`);
    });
}))();
