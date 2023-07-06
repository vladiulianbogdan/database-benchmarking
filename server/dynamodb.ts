const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
import dotenv from "dotenv";
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
import { faker } from "@faker-js/faker";
import { Result } from "./models/result";
dotenv.config();

// Bare-bones DynamoDB Client
const client = new DynamoDBClient({
    region: process.env.MY_AWS_REGION, credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
    }
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export class DynamoDBService {
    /**
    * Generates and saves a specified number of random tasks.
    * @param {number} numTasks - The number of tasks to be generated and saved.
    * @returns {Promise<boolean>} A promise that resolves to `true` when the tasks are generated and saved successfully.
    */
    async populateWithData(numTasks: number): Promise<boolean> {
        const ddbDocClient = DynamoDBDocumentClient.from(client);

        for (let i = 0; i < numTasks; i++) {
            await ddbDocClient.send(
                new PutCommand({
                    TableName: "test",
                    Item: {
                        "test": faker.string.uuid(),
                        title: faker.lorem.words(3),
                        ownerId: faker.string.uuid(),
                        solved: faker.datatype.boolean(),
                    },
                })
            );
        }
        return true;

    }

    /**
    * Performs a database query to retrieve tasks and provides metrics related to the query execution time.
    * @param {number} sleepTime - The duration, in milliseconds, to simulate a sleep or delay after the query execution.
    * @returns {Promise<Result>} A promise that resolves to an object containing information about the query execution and its success status.
    */ 
    async makeQuery(sleepTime: number): Promise<Result> {
        try {
            const start = new Date().getTime();
            const params = {
                TableName: 'test',
                Limit: 10
            };
            await ddbDocClient.send(new ScanCommand(params));
            const end = new Date().getTime();

            await new Promise((resolve) => setTimeout(resolve, sleepTime));
            console.log(`Query took ${end - start} ms`);

            return {
                success: true,
                metrics: {
                    queryTime: end - start,
                    connectionTime: 0,
                }
            }
        } catch (error: any) {
            console.log(`Error retrieving tasks: ${error}`);
            return {
                success: false,
                error: error.toString(),
            };
        }
    }
}