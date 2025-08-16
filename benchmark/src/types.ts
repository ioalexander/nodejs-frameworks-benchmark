export type LatencyStats = {
  min: number;
  max: number;
  mean: number;
  stddev: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
};

export type RequestStats = {
  total: number;
  successful: number;
  failed: number;
  rps: number;
  latency: LatencyStats;
};

export type TimeSeries = {
  timestampt: string;
  value: number;
}[];

export type SystemStats = {
  lowestcpu: number;
  mediancpu: number;
  averagecpu: number;
  highestcpu: number;
  cpu: TimeSeries;
  lowestmemory: number;
  medianmemory: number;
  averagememory: number;
  highestmemory: number;
  memory: TimeSeries;
};

export type FrameworkResult = {
  name: string;
  result: {
    requests: RequestStats;
    system: SystemStats;
  };
};

export type BenchmarkResult = {
  framework: FrameworkResult[];
};
