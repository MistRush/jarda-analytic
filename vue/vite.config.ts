import sharedConfig from "../www/jolanda/front-vue/src/App/configs/vite.base.config.js";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
const baseConfig = sharedConfig({
command,
//@ts-ignore
projectRoot: __dirname,
});

return {
...baseConfig,
};
});