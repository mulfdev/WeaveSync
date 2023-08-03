import { setupDb } from "./scripts/setupDb";
import { runIndexer } from "./core/indexer";

async function main() {
  setupDb();
  runIndexer({ throttleTime: 5, maxRetries: 3 });
}

main().catch((e) => {
  console.log(e);
  throw new Error(e);
});
