import Arweave from "arweave";
function main() {
  const arweave = Arweave.init({
    host: "arweave.net", // Hostname or IP address for a Arweave host
    port: 443, // Port
    protocol: "https", // Network protocol http or https
  });

  async function getGenesisBlock() {
    let currentHeight = await arweave.network
      .getInfo()
      .then((networkInfo) => networkInfo.height);

    console.log(currentHeight);
    let genesisBlock = null;

    while (currentHeight >= 0) {
      let block = await arweave.blocks.get(currentHeight.toString());
      if (block.indep_hash == "genesis") {
        genesisBlock = block;
        break;
      }
      currentHeight--;
    }

    return genesisBlock;
  }

  getGenesisBlock().then((block) => console.log(block));
}

main();
