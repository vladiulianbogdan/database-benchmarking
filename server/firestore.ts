import admin from "firebase-admin";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { Result } from "./models/result";

var serviceAccount = require("./firestore.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

dotenv.config();

export class FirestoreService {
    db: admin.firestore.Firestore;

    constructor() {
        this.db = admin.firestore();
    }

    /**
    * Generates and saves a specified number of random tasks.
    * @param {number} numTasks - The number of tasks to be generated and saved.
    * @returns {Promise<boolean>} A promise that resolves to `true` when the tasks are generated and saved successfully.
    */
    async populateWithData(numTasks: number): Promise<boolean> {
        var collection = this.db.collection('tasks');

        for (let i = 0; i < numTasks; i++) {
            const ownerId = faker.string.uuid();
            let newTask = {
                title: faker.lorem.words(3),
                ownerId: ownerId,
                solved: faker.datatype.boolean(),
            };

            await collection.add(newTask);
        }

        return true;
    }

    /**
    * Performs a database query to retrieve tasks and provides metrics related to the query execution time.
    * @param {number} sleepTime - The duration, in milliseconds, to simulate a sleep or delay after the query execution.
    * @returns {Promise<Result>} A promise that resolves to an object containing information about the query execution and its success status.
    */ 
    async makeQuery(sleepTime: number): Promise<Result> {
        const start = new Date().getTime();
        const snapshot = await this.db.collection('tasks').limit(10).get();
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
    }

    /**
     * Performs a write operation by creating a new task in the database and provides metrics related to the operation's execution time.
     * @param {number} sleepTime - The duration, in milliseconds, to simulate a sleep or delay after the write operation.
     * @returns {Promise<Result>} A promise that resolves to an object containing information about the write operation execution and its success status.
     */
    async makeWrite(sleepTime: number): Promise<Result> {
        const start = new Date().getTime();
        const snapshot = await this.db.collection('tasks').add({
            title: faker.lorem.words(3),
            ownerId: faker.string.uuid(),
            solved: faker.datatype.boolean(),
        })
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
    }
}