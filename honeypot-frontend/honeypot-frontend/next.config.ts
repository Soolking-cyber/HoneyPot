import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Prevent Next from inferring the workspace root as the user folder
  // when it sees another lockfile outside `frontend/`.
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias ?? {};
    config.resolve.alias["@react-native-async-storage/async-storage"] = path.resolve(
      __dirname,
      "src/lib/stubs/async-storage"
    );
    config.resolve.alias["pino-pretty"] = path.resolve(__dirname, "src/lib/stubs/pino-pretty");
    return config;
  },
};

export default nextConfig;
