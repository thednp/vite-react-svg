import { defineConfig } from "vitest/config";
// import react from "@vitejs/plugin-react";

export default defineConfig({
  // plugins: [(react as any)()],
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text", "lcov"],
      enabled: true,
      include: [
        "src/index.mjs"
      ],
    },
  },
});
