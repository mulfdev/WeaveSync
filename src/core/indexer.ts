import Arweave from "arweave";

import { addToDB } from "../lib/db";
import { BlockData } from "arweave/node/blocks";
import Database, { SqliteError } from "better-sqlite3";

const arweave = Arweave.init({
  host: "arweave.net", // Hostname or IP address for a Arweave host
  port: 80, // Port
  protocol: "http", // Network protocol http or https
});

const db = new Database("data.db");

let currentBlock: BlockData | null = null;

const maxRetries = 2;
let retries = 0;

async function runIndexer() {
  console.log("retries count ", retries);
  while (retries < maxRetries) {
    try {
      const lastBlock = db.prepare("SELECT * FROM lastBlock LIMIT 1").get();
      console.log({ lastBlock });

      await arweave.network.getInfo();

      currentBlock = await arweave.blocks.getCurrent();

      if (currentBlock === null) {
        throw new Error("Could not fetch block");
      }

      console.log("*** indexer started ***\n");
      while (currentBlock.previous_block) {
        currentBlock = await arweave.blocks.get(currentBlock.previous_block);

        addToDB(currentBlock, 25);

        await new Promise((res) => setTimeout(res, 5));
      }
    } catch (e) {
      retries++;
      console.log("in the catch: ", retries);

      if (retries === maxRetries) {
        throw new Error("Max retries exceeded");
      }

      if (e instanceof SqliteError) {
        console.error("Caught an SqliteError:", e.message);
        console.log(
          "*** dont forget to run the database setup command: npm run setupDB"
        );
      }
      console.error(`Error encountered: ${e}. Retrying in 5 seconds...`);
      await new Promise((res) => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
    }
  }
}

runIndexer();
