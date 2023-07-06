import { MongoDBDataApiService } from './sdk/mongoDBDataApiService.sdk.js';
import { MongoDBConnectService } from './sdk/mongoDBConnectService.sdk.js';
import { FirestoreService } from './sdk/firestoreService.sdk.js';
import { DynamoDBService } from './sdk/dynamoDBService.sdk.js';
import { exec } from 'child_process';

export type BenchmarkResult = {
  coldStartTimes: number[],
  warmTimes: number[],
}

// This is the delay between requests. You can change this to different values.
// A lower value will put more pressure on the databases.
// A higher value will put less pressure on the databases.
const sleepBetweenQueriesInMs = 100;

// Function to run a command as a promise
function runCommand(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: "../server" }, (error, stdout, stderr) => {
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
async function benchmarkMongoDbConnect(count: number): Promise<BenchmarkResult> {
  const coldStartPromises = [];
  const warmTimes = [];
  // Perform cold start queries
  while (coldStartPromises.length < count) {
    await new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
    const promise = MongoDBConnectService.makeQuery(25000).catch((e) => {
      return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() }
    });
    coldStartPromises.push(promise);
  }

  const coldStartTimes = (await Promise.all(coldStartPromises))
    .filter((result) => result !== undefined)
    .filter((result) => result.success === true)
    .map((result) => {
      return result.metrics!.queryTime
    });

  // Perform warm queries
  while (warmTimes.length < count) {
    const result = await MongoDBConnectService.makeQuery(0);
    warmTimes.push(result.metrics!.queryTime);
  }

  return { coldStartTimes, warmTimes };
}

// Benchmark the MongoDB Data API
async function benchmarkMongoDbDataApi(count: number): Promise<BenchmarkResult> {
  const coldStartPromises = [];
  const warmTimes = [];
  // Perform cold start queries
  while (coldStartPromises.length < count) {
    await new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
    const promise = MongoDBDataApiService.makeQuery(25000).catch((e) => {
      return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() }
    });
    coldStartPromises.push(promise);
  }

  const coldStartTimes = (await Promise.all(coldStartPromises))
    .filter((result) => result !== undefined)
    .filter((result) => result.success === true)
    .map((result) => {
      return result.metrics!.queryTime
    });

  // Perform warm queries
  while (warmTimes.length < count) {
    const result = await MongoDBDataApiService.makeQuery(0);
    warmTimes.push(result.metrics!.queryTime);
  }

  return { coldStartTimes, warmTimes };
}

// Benchmark the DynamoDB
async function benchmarkDynamoDB(count: number): Promise<BenchmarkResult> {
  const coldStartPromises = [];
  const warmTimes = [];
  // Perform cold start queries
  while (coldStartPromises.length < count) {
    await new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
    const promise = DynamoDBService.makeQuery(25000).catch((e) => {
      return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() }
    });
    coldStartPromises.push(promise);
  }

  const coldStartTimes = (await Promise.all(coldStartPromises))
    .filter((result) => result.success === true)
    .map((result) => result.metrics!.queryTime);

  // Perform warm queries
  while (warmTimes.length < count) {
    const result = await DynamoDBService.makeQuery(0);
    warmTimes.push(result.metrics!.queryTime);
  }

  return { coldStartTimes, warmTimes };
}

// Benchmark the Firebase
async function benchmarkFirebase(count: number): Promise<BenchmarkResult> {
  const coldStartPromises = [];
  const warmTimes = [];
  // Perform cold start queries
  while (coldStartPromises.length < count) {
    await new Promise((resolve) => setTimeout(resolve, sleepBetweenQueriesInMs));
    const promise = FirestoreService.makeQuery(25000).catch((e) => {
      console.error(e);
      return { success: false, metrics: { queryTime: 0, connectionTime: 0 }, error: e.toString() }
    });
    coldStartPromises.push(promise);
  }

  const coldStartTimes = (await Promise.all(coldStartPromises))
    .filter((result) => result.success === true)
    .map((result) => result.metrics!.queryTime);

  // Perform warm queries
  while (warmTimes.length < count) {
    const result = await FirestoreService.makeQuery(0);
    warmTimes.push(result.metrics!.queryTime);
  }

  return { coldStartTimes, warmTimes };
}

(async () => {
  console.log("Starting benchmark...");
  let mongoDbDataApiTimes: BenchmarkResult
  let firebaseTimes: BenchmarkResult = {
    coldStartTimes: [],
    warmTimes: []
  }
  let mongoDbConnectTimes: BenchmarkResult
  let dynamodbTimes: BenchmarkResult

  // The number of AWS Lambda that we want to run in parallel.
  const count = 300;

  // We do a deploy in order to make sure that the functions will have a cold start.
  console.log("Start deploying")
  await runCommand("genezio deploy --backend");
  console.log("Finished deploying")

  await new Promise((resolve) => setTimeout(resolve, 1000));
  mongoDbDataApiTimes = await benchmarkMongoDbDataApi(count);
  firebaseTimes = await benchmarkFirebase(count);
  mongoDbConnectTimes = await benchmarkMongoDbConnect(count);
  dynamodbTimes = await benchmarkDynamoDB(count);

  // Printing the results
  console.log("Benchmarking with ", count, " requests");
  console.log("MongoDB Data API cold, MongoDB Data API warm, Firebase cold, Firebase warm, MongoDB Connect cold, MongoDB Connect warm, DynamoDB cold, DynamoDB warm")
  mongoDbDataApiTimes.coldStartTimes.forEach((item, index) => {
    console.log(`${item}, ${mongoDbDataApiTimes.warmTimes[index]}, ${firebaseTimes.coldStartTimes[index]}, ${firebaseTimes.warmTimes[index]}, ${mongoDbConnectTimes.coldStartTimes[index]}, ${mongoDbConnectTimes.warmTimes[index]}, ${dynamodbTimes.coldStartTimes[index]}, ${dynamodbTimes.warmTimes[index]}`);
  });
})();
