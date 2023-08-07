import { BlockData } from "arweave/node/blocks";
import Database from "better-sqlite3";

const db = new Database("data.db");

const batch: BlockData[] = [];

export function addToDB(blockData: BlockData, batchSize: number) {
  if (batch.length >= batchSize) {
    const insertBlock = db.prepare(
      "INSERT INTO block_data (blockNumber, data) VALUES (@blockNumber, @data)"
    );

    const insertMany = db.transaction((blocks: BlockData[]) => {
      const date = new Date();
      console.log("blocks parsed ", blocks.length);
      console.log("last saved block ", blocks[batchSize - 1]?.height);
      console.log(
        `Timestamp: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      );
      console.log("---------------------------");
      console.log("");
      for (const block of blocks) {
        insertBlock.run({
          blockNumber: block.height,
          data: JSON.stringify(block),
        });
      }

      db.prepare("DELETE FROM lastBlock").run();

      const stmt = db.prepare("INSERT INTO lastBlock (id) VALUES (@id)");

      stmt.run({ id: blocks[batchSize - 1]?.indep_hash.toString() });
    });

    insertMany(batch);

    batch.length = 0;
  }

  batch.push(blockData);
}
