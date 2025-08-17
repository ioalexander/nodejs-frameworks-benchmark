import Fastify from "fastify";

const app = Fastify({ logger: false });

app.get("/hello", async () => ({ message: "Hello from Fastify!" }));

app.post("/post-parse-and-return", async (request) => {
  const body = request.body as any;

  let sum = 0;
  if (body && Array.isArray(body.numbers)) {
    for (let i = 0; i < body.numbers.length; i++) {
      sum += Math.sqrt(body.numbers[i]);
    }
  }

  const memBlob = body && body.name ? body.name.repeat(100) : "";

  return {
    original: body,
    sum,
    memBlobLength: memBlob.length,
    timestamp: Date.now(),
  };
});

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Fastify running at ${address}`);
});
