import typescript from "rollup-plugin-typescript2";
import { eslint } from "rollup-plugin-eslint";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/core.ts",
  output: {
    file: "./lib/core.js",
    format: "esm"
  },
  plugins: [typescript(), eslint(), filesize(), terser()]
};
