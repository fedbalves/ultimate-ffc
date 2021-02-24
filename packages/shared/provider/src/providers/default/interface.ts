export type DataReturnTypes =
  | Record<number | string, unknown>
  | string
  | null
  | void;

type QueryType = string;

export class NotImplementedException extends Error {
  constructor() {
    super("Not Implemented Exception");
  }
}

export interface ICRUD {
  isConnected(query?: QueryType): boolean | void;
  read(query?: QueryType): DataReturnTypes;
  save(query?: QueryType): DataReturnTypes | boolean;
  update(query?: QueryType): DataReturnTypes | boolean;
  delete(query?: QueryType): DataReturnTypes | boolean;
  count(query?: QueryType): number | void;
}
