# Node.js Frameworks Benchmark

This project benchmarks popular Node.js backend frameworks, measuring **CPU usage, memory footprint, and performance**.

View results and download data here: [Node.js Frameworks Benchmark](https://ioalexander.github.io/nodejs-frameworks-benchmark/)

## Benchmarked Frameworks

- Fastify
- Express
- NestJS (default Express)
- NestJS (Fastify adapter)

More frameworks will be added over time.

## Development Setup

```bash
# Backend
cd benchmark
yarn install               # Install benchmark dependencies
yarn install:all           # Install all frameworks' dependencies
yarn build:all             # Build all frameworks
yarn start:benchmark       # Run benchmarks

# Frontend
cd ../frontend
yarn install               # Install frontend dependencies
yarn dev                   # Serve the frontend on http://localhost:3000
```

## Contributing

Contributions are welcome!

To add a new framework:

1. Add its implementation in `/frameworks-impl`.
2. Register the framework in `/benchmark/src/benchmark.ts`.
