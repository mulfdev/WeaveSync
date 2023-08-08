import Arweave from "arweave";

import { addToDB } from "../lib/db";
import { BlockData } from "arweave/node/blocks";
import Database, { SqliteError } from "better-sqlite3";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

const db = new Database("data.db");

let currentBlock: BlockData | null = null;

async function runIndexer() {
  while (true) {
    try {
      let lastBlock = db.prepare("SELECT * FROM lastBlock LIMIT 1").get() as {
        id: string;
      };
      console.log({ lastBlock });

      if (lastBlock.id) {
        currentBlock = await arweave.blocks.get(lastBlock.id);
      } else {
        currentBlock = await arweave.blocks.getCurrent();
      }

      if (currentBlock === null) {
        throw new Error("Could not fetch block");
      }

      console.log("*** indexer started ***\n");
      while (currentBlock.previous_block) {
        currentBlock = await arweave.blocks.get(currentBlock.previous_block);

        addToDB(currentBlock, 25);

        await new Promise((res) => setTimeout(res, 5));
      }

      console.log("no more blocks");
      process.exit(1);
    } catch (e) {
      if (e instanceof SqliteError) {
        console.error(
          "*** dont forget to run the database setup command: npm run setupDB"
        );
        process.exit(1);
      }
      console.error(`Error encountered: ${e}. Retrying in 10 seconds...`);
      await new Promise((res) => setTimeout(res, 10000)); // Wait for 10 seconds before retrying
    }
  }
}

runIndexer();
