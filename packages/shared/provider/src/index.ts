import { Pesdb } from "./providers/pesdb";
import Debug from "./utils/debug";

main();
async function main() {
  const debug = new Debug({ service: "@fanaticofc/provider" });
  debug.log("Initiating proccess...");

  const pesdb = new Pesdb();
  const status = await pesdb.validateVersion();

  debug.log(status);
}
