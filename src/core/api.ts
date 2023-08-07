import Fastify from "fastify";
import Database from "better-sqlite3";
const db = new Database("data.db");

const fastify = Fastify({
  logger: {
    level: "info",
  },
});

interface IQuerystring {
  blockNumber?: number;
}

interface IBlockData {
  blockNumber: number;
  data: string;
}

export function api() {
  fastify.get<{
    Querystring: IQuerystring;
  }>("/", (req, reply) => {
    if (!req.query.blockNumber) {
      reply.status(400).send({ error: "Missing Block Number" });
    }
    const result = db
      .prepare("SELECT * FROM block_data WHERE blockNumber = ?")
      .get(req.query.blockNumber) as IBlockData | undefined;

    console.log({ result });
    if (result && result.data) {
      reply.send({ data: JSON.parse(result.data) });
    }
    reply.send({ message: "block not found" });
  });

  // Run the server!
  fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err;
    console.log(`Server is now listening on ${address}`);
  });
}
