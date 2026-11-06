import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

process.loadEnvFile();

const logPath = resolve(".pose-cache-test.log");

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL: "http://localhost:3109",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts$/ },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: { storageState: "playwright/.auth/user.json" },
    },
  ],
  webServer: {
    env: { E2E_POSE_CACHE_PROBE: "1" },
    command: "pnpm run start --hostname 127.0.0.1 --port 3109 > .pose-cache-test.log 2>&1",
    url: "http://localhost:3109/login",
    reuseExistingServer: false,
  },
  metadata: { poseCacheLog: logPath },
});
