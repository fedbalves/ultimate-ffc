import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

import { DataTable, getIpOfCountry, setDataTable } from "country-ip-spoofer";
import Request from "request";

type formatTypes = "html" | "json";

export interface IClient {
  format?: formatTypes;
  followRedirects?: boolean;
}

interface IResponse extends http.IncomingMessage {
  request?: {
    path?: string;
  };
}

export interface IClientResponse {
  data: Record<any, unknown> | string;
  res: IResponse;
}

const kGetIpCountry = Symbol("get-ip-country");

const dataSet: string = fs.readFileSync(
  path.resolve("./src/IP-COUNTRIES.csv"),
  "utf-8"
);

setDataTable(JSON.parse(dataSet) as DataTable);

export default class ClientClass {
  #format: IClient["format"];

  #followRedirects: IClient["followRedirects"];

  #request;

  #url?: URL;

  #fetcher?: typeof http | typeof https;

  constructor(args: IClient = {}) {
    this.#format = args.format || "json";
    this.#followRedirects = args.followRedirects || false;
    this.#request = Request;
  }

  private [kGetIpCountry](): void {
    getIpOfCountry("BR");
  }

  public fetch(url: string): Promise<IClientResponse> {
    if (!url || url === "") {
      throw new Error("Você tá ligado que enviou uma string vazia, né?");
    }

    this[kGetIpCountry]();

    this.#url = new URL(url);

    this.#fetcher = this.#url.protocol.startsWith("https") ? https : http;

    return new Promise((resolve, reject) => {
      this.#fetcher?.get(this.#url?.toJSON() as string, res => {
        let data = "";

        res.on("data", (chunk: unknown) => {
          data += chunk;
        });

        res.on("end", () => {
          if (
            this.#followRedirects &&
            [301, 302].includes(res.statusCode as number)
          ) {
            try {
              this.#request(
                res.headers.location as string,
                (error: any, response: any, body: any) => {
                  if (error) {
                    reject(error);
                    return;
                  }

                  resolve({
                    data: this.#format === "json" ? JSON.parse(body) : body,
                    res: response,
                  });
                }
              );

              return;
            } catch (e: unknown) {
              reject(e);
            }
          }

          try {
            if (this.#format === "json") {
              resolve({ data: JSON.parse(data), res });
              return;
            }

            resolve({ data, res });
          } catch (e: unknown) {
            reject(e);
          }
        });

        res.on("error", (err: Error) => {
          reject(err);
        });
      });
    });
  }
}
