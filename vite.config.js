import { defineConfig } from "vite";

// Serve `src` during dev (HMR) and proxy API requests to the Express server
export default defineConfig({
  root: "src",
  server: {
    port: 5173,
    proxy: {
      // Proxy instantiate and prompt endpoints to the backend server
      "/instantiate": "http://localhost:3000",
      "/prompt": "http://localhost:3000",
      "/instances": "http://localhost:3000",
    },
  },
});
