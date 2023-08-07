import { setupDb } from "./scripts/setupDb";
import { runIndexer } from "./core/indexer";
import { api } from "./core/api";

async function main() {
  setupDb();
  api();
  runIndexer({ throttleTime: 5, maxRetries: 3 });
}

main().catch((e) => {
  console.log(e);
  throw new Error(e);
});
