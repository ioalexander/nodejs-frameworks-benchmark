import { spawn, ChildProcess } from "child_process";
import autocannon, { Client } from "autocannon";
import pidusage from "pidusage";
import fs from "fs";
import path from "path";
import {
  BenchmarkResult,
  FrameworkResult,
  RequestStats,
  LatencyStats,
  SystemStats,
  TimeSeries,
} from "./types";

interface Target {
  name: string;
  command: string[];
  port: number;
  folder: string;
}

const targets: Target[] = [
  {
    name: "nestjs",
    command: ["node", "dist/main.js"],
    port: 3000,
    folder: "../frameworks-impl/minimal/nestjs",
  },
  {
    name: "fastify",
    command: ["node", "dist/server.js"],
    port: 3001,
    folder: "../frameworks-impl/minimal/fastify",
  },
  {
    name: "nestjs-fastify-adapter",
    command: ["node", "dist/main.js"],
    port: 3002,
    folder: "../frameworks-impl/minimal/nestjs-fastify-adapter",
  },
  {
    name: "express",
    command: ["node", "dist/server.js"],
    port: 3004,
    folder: "../frameworks-impl/minimal/express",
  },
];

async function monitorProcess(
  proc: ChildProcess,
  duration: number,
): Promise<SystemStats> {
  if (!proc.pid) throw new Error("Process PID is undefined");

  const cpuSeries: TimeSeries = [];
  const memorySeries: TimeSeries = [];
  const startTime = Date.now();

  return new Promise((resolve) => {
    let stopped = false;

    const poll = async () => {
      if (stopped) return;

      try {
        const usage = await pidusage(proc.pid!);
        const elapsed = Date.now() - startTime; // elapsed ms since start
        cpuSeries.push({
          timestampt: new Date(elapsed).toString(),
          value: usage.cpu,
        });
        memorySeries.push({
          timestampt: new Date(elapsed).toString(),
          value: usage.memory,
        });
      } catch (err) {
        console.error("Failed to get PID usage:", err);
      }

      setTimeout(poll, 100);
    };

    poll();

    setTimeout(() => {
      stopped = true;

      const cpuValues = cpuSeries.map((c) => c.value);
      const memValues = memorySeries.map((m) => m.value);

      const getStats = (arr: number[]) => {
        const sorted = [...arr].sort((a, b) => a - b);
        return {
          lowest: Math.min(...arr),
          median: sorted[Math.floor(sorted.length / 2)],
          average: arr.reduce((a, b) => a + b, 0) / arr.length,
          highest: Math.max(...arr),
        };
      };

      const cpuStats = getStats(cpuValues);
      const memoryStats = getStats(memValues);

      resolve({
        lowestcpu: cpuStats.lowest,
        mediancpu: cpuStats.median,
        averagecpu: cpuStats.average,
        highestcpu: cpuStats.highest,
        cpu: cpuSeries,
        lowestmemory: memoryStats.lowest,
        medianmemory: memoryStats.median,
        averagememory: memoryStats.average,
        highestmemory: memoryStats.highest,
        memory: memorySeries,
      });
    }, duration);
  });
}

function extractLatencyStats(result: any): LatencyStats {
  return {
    min: result.latency.min,
    max: result.latency.max,
    mean: result.latency.mean,
    stddev: result.latency.stddev,
    p50: result.latency.p50,
    p75: result.latency.p75,
    p90: result.latency.p90,
    p99: result.latency.p99,
  };
}

function extractRequestStats(result: any): RequestStats {
  const total = result.requests.total ?? 0;
  const errors = result.requests.errors ?? 0;

  return {
    total: result.requests.total,
    successful: total - errors,
    failed: errors,
    rps: result.requests.average,
    latency: extractLatencyStats(result),
  };
}

function randomPayload() {
  return JSON.stringify({
    numbers: Array.from({ length: 50 }, () => Math.floor(Math.random() * 1000)),
    name: Math.random().toString(36).substring(2, 10),
    active: Math.random() > 0.5,
  });
}

async function runAutocannon(port: number, durationMs: number) {
  return autocannon({
    url: `http://localhost:${port}/post-parse-and-return`,
    connections: 100,
    duration: durationMs / 1000,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    requests: Array.from({ length: 100 }, () => ({
      method: "POST",
      path: "/post-parse-and-return",
      body: randomPayload(),
      headers: { "Content-Type": "application/json" },
    })),
  });
}

async function runBenchmark() {
  const benchmarkResults: BenchmarkResult = { framework: [] };

  for (const t of targets) {
    console.log(`\nStarting ${t.folder} server...`);

    const proc = spawn(t.command[0], t.command.slice(1), {
      cwd: t.folder,
      stdio: "inherit",
    });
    await new Promise((res) => setTimeout(res, 2000));

    console.log(`Benchmarking ${t.folder}...`);
    const durationMs = 30000;

    const [benchResult, systemStats] = await Promise.all([
      runAutocannon(t.port, durationMs),
      monitorProcess(proc, durationMs),
    ]);

    const frameworkResult: FrameworkResult = {
      name: t.name,
      result: {
        requests: extractRequestStats(benchResult),
        system: systemStats,
      },
    };

    benchmarkResults.framework.push(frameworkResult);
    proc.kill();
  }

  const outputDir = path.resolve("./output");
  fs.mkdirSync(outputDir, { recursive: true });

  const frontendOutputDir = path.resolve("../frontend/output");
  fs.mkdirSync(frontendOutputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "results.json"),
    JSON.stringify(benchmarkResults, null, 2),
  );
  fs.writeFileSync(
    path.join(frontendOutputDir, "results.json"),
    JSON.stringify(benchmarkResults, null, 2),
  );

  console.log("\nBenchmark finished. Results saved to results.json");
}

runBenchmark();
