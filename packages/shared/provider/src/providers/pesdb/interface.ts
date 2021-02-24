import { IClientResponse } from "../../utils/client";
import { IWorker } from "../../utils/workerPool";
import { DataReturnTypes } from "../default";

export interface ReturnData {
  data: DataReturnTypes;
  debug: IWorker["debug"];
  res: IClientResponse["res"];
}

export enum versionStatus {
  NOT_EXISTS = "Values are VALID and NOT IN database",
  EXISTS = "Values are VALID and IN database",
  MISSING_VALUES = "Missing some values",
  INVALID = "Values are NOT valid. Must've changed HTML structure",
}
