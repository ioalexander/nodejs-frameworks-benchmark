import express from "express";

const app = express();
const PORT = 3004;

// Middleware to parse JSON
app.use(express.json());

// GET endpoint
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// POST endpoint with silly workload
app.post("/post-parse-and-return", (req, res) => {
  const body = req.body;

  // Silly CPU-bound task
  let sum = 0;
  if (body && Array.isArray(body.numbers)) {
    for (let i = 0; i < body.numbers.length; i++) {
      sum += Math.sqrt(body.numbers[i]);
    }
  }

  // Silly memory task
  const memBlob = body && body.name ? body.name.repeat(100) : "";

  res.json({
    original: body,
    sum,
    memBlobLength: memBlob.length,
    timestamp: Date.now(),
  });
});

app.listen(PORT, () => {
  console.log(`Express running at http://localhost:${PORT}`);
});
