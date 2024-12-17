import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   host: '0.0.0.0', // Listen on all network interfaces
  //   port: 5173, // You can specify the port here
  // },
})
