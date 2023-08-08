import Database from "better-sqlite3";
const db = new Database("data.db");

function setupDb() {
  console.log("*** preparing database ***");
  db.pragma("journal_mode = WAL");

  db.exec(`CREATE TABLE IF NOT EXISTS block_data (
      blockNumber INTEGER,
      data TEXT
    )
  `);

  db.exec(`CREATE TABLE IF NOT EXISTS lastBlock (id TEXT)`);

  const addInitBlock = db.prepare("INSERT INTO lastBlock (id) VALUES (@id)");
  addInitBlock.run({ id: "" });
}

setupDb();
