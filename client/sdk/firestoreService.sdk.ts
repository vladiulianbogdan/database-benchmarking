/**
* This is an auto generated code. This code should not be modified since the file can be overwriten
* if new genezio commands are executed.
*/

import { Remote } from "./remote";
import { Result } from "./models/result";


export class FirestoreService {
  static remote = new Remote("https://gem8024kp1.execute-api.eu-central-1.amazonaws.com/prod//FirestoreService");

  static async populateWithData(numTasks: number): Promise<boolean> {
    return await FirestoreService.remote.call("FirestoreService.populateWithData", numTasks);
  }
  static async makeQuery(sleepTime: number): Promise<Result> {
    return await FirestoreService.remote.call("FirestoreService.makeQuery", sleepTime);
  }
  static async makeWrite(sleepTime: number): Promise<Result> {
    return await FirestoreService.remote.call("FirestoreService.makeWrite", sleepTime);
  }
}

export { Remote };
