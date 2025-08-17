import Fastify from "fastify";

const app = Fastify({ logger: false });

app.get("/hello", async () => ({ message: "Hello from Fastify!" }));

app.post("/post-parse-and-return", async (request) => {
  return request.body;
});

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Fastify running at ${address}`);
});
