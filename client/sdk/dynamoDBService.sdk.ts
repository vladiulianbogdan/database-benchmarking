/**
* This is an auto generated code. This code should not be modified since the file can be overwriten
* if new genezio commands are executed.
*/

import { Remote } from "./remote";
import { Result } from "./models/result";


export class DynamoDBService {
  static remote = new Remote("https://gem8024kp1.execute-api.eu-central-1.amazonaws.com/prod//DynamoDBService");

  static async populateWithData(numTasks: number): Promise<boolean> {
    return await DynamoDBService.remote.call("DynamoDBService.populateWithData", numTasks);
  }
  static async makeQuery(sleepTime: number): Promise<Result> {
    return await DynamoDBService.remote.call("DynamoDBService.makeQuery", sleepTime);
  }
}

export { Remote };
