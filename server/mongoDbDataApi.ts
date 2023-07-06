import dotenv from "dotenv";
import axios, { AxiosInstance, Method } from 'axios';
import http from 'http';
import https from 'https';
import { Result } from "./models/result";
import { faker } from '@faker-js/faker';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const instance = axios.create({
  httpAgent,
  httpsAgent
});

dotenv.config();

/**
 * The User server class that will be deployed on the genezio infrastructure.
 */
export class MongoDBDataApiService {

  /**
  * Performs a database query to retrieve tasks and provides metrics related to the query execution time.
  * @param {number} sleepTime - The duration, in milliseconds, to simulate a sleep or delay after the query execution.
  * @returns {Promise<Result>} A promise that resolves to an object containing information about the query execution and its success status.
  */
  async makeQuery(sleepTime: number): Promise<Result> {
    try {
      const start = new Date().getTime();
      await this.#dataApiQuery(instance);
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
      console.error(`Error retrieving tasks: ${error.response.data}`);
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
      const start = new Date().getTime();
      await this.#dataApiQuery(instance);
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
    } catch (error) {
      console.error(`Error retrieving tasks: ${error}`);
      return {
        success: false,
      };
    }
  }

  async #dataApiQuery(axios: AxiosInstance) {
    let data = JSON.stringify({
      "collection": "tasks",
      "database": "test",
      "dataSource": "Cluster0",
      "limit": 10
    });

    let config = {
      method: 'POST' as Method,
      maxBodyLength: Infinity,
      url: process.env.MONGO_DB_DATA_API_URI + "/action/find",
      headers: {
        'api-key': process.env.MONGO_DB_DATA_API_KEY,
        'Content-Type': 'application/json'
      },
      maxRedirects: 0,
      data: data
    };

    const response = await axios.request(config)

    console.log(JSON.stringify(response.data));
  }

  async #dataApiWrite(axios: AxiosInstance) {
    let data = JSON.stringify({
      "collection": "tasks",
      "database": "test",
      "dataSource": "Cluster0",
      "document": {
        title: faker.lorem.words(3),
        ownerId: faker.string.uuid(),
        solved: faker.datatype.boolean(),
      }
    });

    let config = {
      method: 'POST' as Method,
      maxBodyLength: Infinity,
      url: process.env.MONGO_DB_DATA_API_URI + "/action/insertOne",
      headers: {
        'api-key': process.env.MONGO_DB_DATA_API_KEY,
        'Content-Type': 'application/json'
      },
      maxRedirects: 0,
      data: data
    };

    const response = await axios.request(config)

    console.log(JSON.stringify(response.data));

  }
}
