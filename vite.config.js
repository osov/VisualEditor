import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    server: {
        host: '0.0.0.0', // или '0.0.0.0' для всех интерфейсов
        port: 5173
    },
    plugins: [
        vue(),

    ],
});