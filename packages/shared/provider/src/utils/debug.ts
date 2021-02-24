import Debug, { Debugger } from "debug";

const kSetup = Symbol("setup");

interface IDebug {
  service: string;
}

export default class DebugClass {
  #debugLibrary;

  #debugger?: Debugger;

  constructor(args: IDebug) {
    this.#debugLibrary = Debug;
    this[kSetup](args.service);
  }

  private [kSetup](service: string): void {
    if (service === "") {
      throw new Error('Você passou uma "String" vazia. É isso mesmo?!');
    }

    this.#debugger = this.#debugLibrary(service);
  }

  public log(data: unknown): void {
    this.#debugger && this.#debugger(data);
  }
}
