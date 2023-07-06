/**
* This is an auto generated code. This code should not be modified since the file can be overwriten
* if new genezio commands are executed.
*/

import { Remote } from "./remote";
import { Result } from "./models/result";


export class MongoDBDataApiService {
  static remote = new Remote("https://gem8024kp1.execute-api.eu-central-1.amazonaws.com/prod//MongoDBDataApiService");

  static async makeQuery(sleepTime: number): Promise<Result> {
    return await MongoDBDataApiService.remote.call("MongoDBDataApiService.makeQuery", sleepTime);
  }
  static async makeWrite(sleepTime: number): Promise<Result> {
    return await MongoDBDataApiService.remote.call("MongoDBDataApiService.makeWrite", sleepTime);
  }
}

export { Remote };
