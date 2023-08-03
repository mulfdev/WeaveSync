import { BlockData } from "arweave/node/blocks";
import Database from "better-sqlite3";

const db = new Database("data.db");
db.pragma("journal_mode = WAL");

const batch: BlockData[] = [];
export function addToDB(blockData: BlockData) {
  db.exec(`CREATE TABLE IF NOT EXISTS block_data (
    blockNumber INTEGER,
    data TEXT
    )`);

  if (batch.length >= 30) {
    console.log("inside yeet");
    const insert = db.prepare(
      "INSERT INTO block_data (blockNumber, data) VALUES (@blockNumber, @data)"
    );

    const insertMany = db.transaction((blocks: BlockData[]) => {
      for (const block of blocks) {
        console.log({ blockNumber: block.height });
        insert.run({ blockNumber: block.height, data: JSON.stringify(block) });
      }
    });

    insertMany(batch);
    batch.length = 0;
  }

  batch.push(blockData);
  console.log("pushed to batch ", batch.length);
}
