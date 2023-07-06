import mongoose from "mongoose"
import dotenv from "dotenv";
import { faker } from '@faker-js/faker';
import { TaskModel } from "./database/task"
import { Result } from "./models/result";


dotenv.config();

/**
 * The User server class that will be deployed on the genezio infrastructure.
 */
export class MongoDBConnectService {
  connectTimeStart: number;
  connectTimeEnd: number;
  alreadyConnected = false;

  constructor() {
    this.connectTimeStart = 0;
    this.connectTimeEnd = 0;
  }

  /**
   * Private method used to connect to the DB.
   */
  async #connect() {
    if (this.alreadyConnected) {
      return true;
    }

    this.connectTimeStart = new Date().getTime();
    await mongoose.connect(process.env.MONGO_DB_URI!);
    this.connectTimeEnd = new Date().getTime();
    console.log(`Connected to MongoDB in ${this.connectTimeEnd - this.connectTimeStart} ms`);
    this.alreadyConnected = true;

    return true;
  }


  /**
  * Generates and saves a specified number of random tasks.
  * @param {number} numTasks - The number of tasks to be generated and saved.
  * @returns {Promise<boolean>} A promise that resolves to `true` when the tasks are generated and saved successfully.
  */
  async populateWithData(numTasks: number): Promise<boolean> {
    console.log(`Generating ${numTasks} random tasks...`);

    for (let i = 0; i < numTasks; i++) {
      const ownerId = faker.string.uuid();
      let newTask = new TaskModel({
        title: faker.lorem.words(3),
        ownerId: ownerId,
        solved: faker.datatype.boolean(),
      });

      try {
        await newTask.save();
      } catch (error) {
        console.error(`Error saving task: ${error}`);
      }
    }

    console.log(`Generated ${numTasks} tasks successfully.`);

    return true;
  }

  /**
  * Performs a database query to retrieve tasks and provides metrics related to the query execution time.
  * @param {number} sleepTime - The duration, in milliseconds, to simulate a sleep or delay after the query execution.
  * @returns {Promise<Result>} A promise that resolves to an object containing information about the query execution and its success status.
  */
  async makeQuery(sleepTime: number): Promise<Result> {
    try {
      await this.#connect();
      const start = new Date().getTime();
      await TaskModel.find({}).limit(10).exec();
      const end = new Date().getTime();

      console.log(`Query took ${end - start} ms`);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));

      return {
        success: true,
        metrics: {
          connectionTime: this.connectTimeEnd - this.connectTimeStart,
          queryTime: end - start,
        }
      }
    } catch (error) {
      console.error(`Error retrieving tasks: ${error}`);
      return {
        success: false,
      };
    }
  }

  /**
  * Performs a write operation by creating a new task in the database and provides metrics related to the operation's execution time.
  * @param {number} sleepTime - The duration, in milliseconds, to simulate a sleep or delay after the write operation.
  * @returns {Promise<Result>} A promise that resolves to an object containing information about the write operation execution and its success status.
  */
  async makeWrite(sleepTime: number): Promise<Result> {
    try {
      await this.#connect();
      const start = new Date().getTime();
      await TaskModel.create({
        title: faker.lorem.words(3),
        ownerId: faker.string.uuid(),
        solved: faker.datatype.boolean(),
      });
      const end = new Date().getTime();

      console.log(`Query took ${end - start} ms`);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));

      return {
        success: true,
        metrics: {
          connectionTime: this.connectTimeEnd - this.connectTimeStart,
          queryTime: end - start,
        }
      }
    } catch (error) {
      console.error(`Error retrieving tasks: ${error}`);
      return {
        success: false,
      };
    }
  }
}
