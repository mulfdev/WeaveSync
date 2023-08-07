import Arweave from "arweave";

import { addToDB } from "./db";
import { BlockData } from "arweave/node/blocks";
import Database from "better-sqlite3";

const arweave = Arweave.init({
  host: "arweave.net", // Hostname or IP address for a Arweave host
  port: 443, // Port
  protocol: "https", // Network protocol http or https
});

const db = new Database("data.db");

type Params = {
  throttleTime: number;
  maxRetries: number;
};

let currentBlock: BlockData | null = null;

export async function runIndexer({ throttleTime, maxRetries }: Params) {
  let retries = 0;

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

        await new Promise((res) => setTimeout(res, throttleTime));
      }
    } catch (e) {
      console.error(`Error encountered: ${e}. Retrying in 5 seconds...`);
      retries++;
      if (retries >= maxRetries) {
        console.error("Max retries reached. Exiting...");
        throw e;
      }
      await new Promise((res) => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
    }
  }
}
