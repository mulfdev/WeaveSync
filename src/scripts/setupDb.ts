import Database from "better-sqlite3";
const db = new Database("data.db");

export function setupDb() {
  console.log("*** preparing database ***");
  db.exec(`CREATE TABLE IF NOT EXISTS block_data (
      blockNumber INTEGER,
      data TEXT
      )`);

  db.exec(`CREATE TABLE IF NOT EXISTS lastBlock (
        id INTEGER
        
        )`);

  db.pragma("journal_mode = WAL");
}
