import { ICRUD, NotImplementedException } from "./interface";

export default class ICRUDClass implements ICRUD {
  isConnected(): void {
    throw new NotImplementedException();
  }

  read(): void {
    throw new NotImplementedException();
  }

  save(): void {
    throw new NotImplementedException();
  }

  update(): void {
    throw new NotImplementedException();
  }

  delete(): void {
    throw new NotImplementedException();
  }

  count(): void {
    throw new NotImplementedException();
  }
}
