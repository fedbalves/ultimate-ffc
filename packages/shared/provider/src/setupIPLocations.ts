import path from "path";

import { createDataTable } from "country-ip-spoofer/dist/dataTableCreator";

import Debug from "./utils/debug";

const debug = new Debug({ service: "IP-COUNTRY-SPOOFER" });

const csfFile = path.resolve("./src/IP2LOCATION-LITE-DB1.CSV");
const outputFile = path.resolve("./src/IP-COUNTRIES.csv");

createDataTable(csfFile, outputFile).then(() => {
  debug.log("Tabela de IPs de países atualizadas com sucesso.");
});
