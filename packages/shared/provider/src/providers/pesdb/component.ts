/**
 * Essa classe é responsável por capturar os dados do
 * site e armazená-los na estratégia escolhida.
 *
 * Função Page:       Realiza somente uma ação simples
 *                    crawling. Retornando o resultado
 *                    imediatamente.
 *
 * Função Crawler:    Prepara o setup adicionando workers
 *                    necessários para executar a ação.
 *                    Os dados são salvos em uma base
 *                    em memória enquanto são executados.
 */

import { ReturnData, versionStatus } from "./interface";

import Parser from "../../utils/htmlParser";
import WorkerPool from "../../utils/workerPool";
import { DefaultCRUD } from "../default";

export default class PesdbClass extends DefaultCRUD {
  #baseUrl;

  #workerPoll: typeof WorkerPool;

  constructor() {
    super();

    this.#baseUrl = "http://pesdb.net/";
    this.#workerPoll = WorkerPool;
  }

  static isConnected(): boolean {
    return true;
  }

  public async read(): Promise<ReturnData> {
    const worker = this.#workerPoll.get();

    try {
      const { data, res } = await worker.client.fetch(this.#baseUrl);
      return { data, debug: worker.debug, res };
    } catch (e: unknown) {
      throw new Error(`Erro ao recuperar os dados. ${e}`);
    } finally {
      this.#workerPoll.returnToPool(worker);
    }
  }

  public save() {
    console.log("TBI");
  }

  public update() {
    console.log("TBI");
  }

  public delete() {
    console.log("TBI");
  }

  public count() {
    console.log("TBI");
  }

  public async validateVersion(): Promise<versionStatus> {
    const { res, data, debug } = await this.read();

    const { request } = res;

    const path = request?.path?.replaceAll("/", "") || "";

    const mapping = {
      version: (element: any) => {
        const text = element.find("div#footer").text().trim();
        const pattern = new RegExp(/(?:[A-Za-z0-9\][0-9]{1,2}[.][0-9]{1,2})/);
        const [version] = pattern.exec(text) as any[];
        return version;
      },
      updatedAt: (element: any) => {
        const text = element.find("div#footer").text().trim();
        const pattern = new RegExp(/([0-9]{1,4}[/][0-9]{1,2}[/][0-9]{1,2})/);
        const [updatedAt] = pattern.exec(text) as any[];
        return new Date(updatedAt).toISOString();
      },
      pages: (element: any) =>
        Number(element.find("div.pages a").last().text()),
    };

    const parsedHtml = Parser.parse(data as string, mapping);

    const databaseHeader = {
      path,
      ...(parsedHtml as Record<string, unknown>),
    };

    debug.log(databaseHeader);

    return versionStatus.EXISTS;
  }
}
