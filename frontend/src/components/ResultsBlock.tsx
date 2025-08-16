import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import resultsData from "./../../output/results.json";
import { BenchmarkResult } from "../../../benchmark/src/types";
import styles from "./ResultsBlock.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const ResultsBlock: React.FC = () => {
  const benchmark: BenchmarkResult = resultsData as unknown as BenchmarkResult;
  const results = benchmark.framework;

  const percentileLabels = ["p50", "p75", "p90", "p99"];

  // RPS chart data
  const rpsChartData = {
    labels: results.map((f) => f.name),
    datasets: [
      {
        label: "Requests per Second (RPS)",
        data: results.map((f) => f.result.requests.rps),
        backgroundColor: "rgba(129,189,3,0.6)",
      },
    ],
  };

  // Latency chart data
  const latencyChartData = {
    labels: results.map((f) => f.name),
    datasets: [
      {
        label: "Min Latency",
        data: results.map((f) => f.result.requests.latency.min),
        backgroundColor: "rgba(129,189,3,0.6)",
      },
      {
        label: "Mean Latency",
        data: results.map((f) => f.result.requests.latency.mean),
        backgroundColor: "rgba(255,205,86,0.6)",
      },
      {
        label: "Max Latency",
        data: results.map((f) => f.result.requests.latency.max),
        backgroundColor: "rgba(250, 75, 50,0.6)",
      },
    ],
  };

  // Latency percentiles per framework (line chart)
  const latencyPercentilesPerFrameworkData = {
    labels: percentileLabels,
    datasets: results.map((f, idx) => ({
      label: f.name,
      data: [
        f.result.requests.latency.p50,
        f.result.requests.latency.p75,
        f.result.requests.latency.p90,
        f.result.requests.latency.p99,
      ],
      borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
      backgroundColor: `hsla(${(idx * 60) % 360}, 70%, 50%, 0.2)`,
      tension: 0.4,
      fill: false,
    })),
  };

  // Memory usage over time per framework (line chart)
  const allTimestampsSet = new Set<string>();
  results.forEach((f) =>
    f.result.system.memory.forEach((m) => allTimestampsSet.add(m.timestampt)),
  );
  const sortedTimestamps = Array.from(allTimestampsSet).sort();

  // 2. Map memory per framework to common timestamps
  const memoryUsagePerFrameworkData = {
    labels: sortedTimestamps, // X axis still needs timestamps internally
    datasets: results.map((f, idx) => {
      const memoryMap: Record<string, number> = {};
      f.result.system.memory.forEach(
        (m) => (memoryMap[m.timestampt] = m.value / 1024 / 1024),
      );

      let lastVal: number | null = null;
      const data = sortedTimestamps.map((t) => {
        if (memoryMap[t] != null) lastVal = memoryMap[t];
        return lastVal;
      });

      return {
        label: f.name,
        data,
        borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
        backgroundColor: `hsla(${(idx * 60) % 360}, 70%, 50%, 0.2)`,
        tension: 0.4,
        fill: false,
        pointRadius: 0, // hide the dots
      };
    }),
  };

  const memoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Memory Usage Over Time (MB)" },
    },
    scales: {
      y: { title: { display: true, text: "Memory (MB)" } },
      x: {
        display: false, // hide the bottom labels
      },
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true },
    },
    scales: {
      y: { title: { display: true, text: "Memory (MB)" } },
      x: { title: { display: true, text: "Timestamp" } },
    },
  };

  return (
    <section className={styles.section} id="results">
      <h2 className={styles.title}>Results</h2>
      <div className={styles.grid}>
        <div className={styles.item}>
          <Bar
            data={rpsChartData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: { display: true, text: "Requests per Second (RPS)" },
              },
            }}
          />
        </div>
        <div className={styles.item}>
          <Line
            data={memoryUsagePerFrameworkData}
            options={memoryChartOptions}
          />
        </div>
        <div className={styles.item}>
          <Bar
            data={latencyChartData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: { display: true, text: "Latency (ms)" },
              },
            }}
          />
        </div>
        <div className={styles.item}>
          <Line
            data={latencyPercentilesPerFrameworkData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: {
                  display: true,
                  text: "Latency Percentiles by Framework (ms)",
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ResutlsBlock;
