import Client from "./client";
import Debug from "./debug";

export interface IWorker {
  client: Client;
  debug: Debug;
}

const kIterateCounter = Symbol("iterate");

class WorkerPollClass {
  #client;

  #debug;

  #pool: IWorker[];

  #count: number;

  constructor() {
    this.#client = Client;
    this.#debug = Debug;
    this.#pool = [];
    this.#count = 0;
  }

  private [kIterateCounter](): number {
    this.#count = this.#count + 1;
    return this.#count;
  }

  public create(): void {
    const client = new this.#client({ format: "html", followRedirects: true });
    const debug = new this.#debug({
      service: `worker-${this[kIterateCounter]()}`,
    });
    debug.log("Added to Pool.");
    this.#pool?.push({ client, debug });
  }

  public get(): IWorker {
    if (this.#pool.length === 0) {
      this.create();
    }

    const worker = this.#pool?.shift() as IWorker;

    worker.debug.log("Selected from Pool");

    return worker;
  }

  public returnToPool(worker: IWorker): void {
    worker.debug.log("Returned to Pool.");
    this.#pool.push(worker);
  }
}

export default new WorkerPollClass();
