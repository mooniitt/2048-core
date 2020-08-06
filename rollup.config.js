import typescript from "@rollup/plugin-typescript";
import { eslint } from "rollup-plugin-eslint";
// import { uglify } from "rollup-plugin-uglify";

export default {
  input: "./src/core.ts",
  output: {
    file: "./lib/index.js",
    format: "esm"
  },
  plugins: [
    typescript({
      include: "./src/core.ts"
    }),
    eslint()
  ]
};
