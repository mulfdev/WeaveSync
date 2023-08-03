import Arweave from "arweave";
import path from "node:path";
import fs from "node:fs";
import { insertBlockDataBatch } from "./core/db";

const arweave = Arweave.init({
  host: "arweave.net", // Hostname or IP address for a Arweave host
  port: 443, // Port
  protocol: "https", // Network protocol http or https
});

type Params = {
  throttleTime: number;
};

async function index({ throttleTime }: Params) {
  // let { height } = await arweave.network.getInfo().catch((e) => {
  //   throw new Error("Could not get current height " + e);
  // });

  let currentBlock = await arweave.blocks.getCurrent().catch((e) => {
    throw new Error("could not get current block hash " + e);
  });

  while (currentBlock.previous_block) {
    currentBlock = await arweave.blocks.get(currentBlock.previous_block);

    insertBlockDataBatch(currentBlock, 3);

    await new Promise((res) => setTimeout(res, throttleTime));
  }
}

function main() {
  index({ throttleTime: 800 });
}

main();
