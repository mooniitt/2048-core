import typescript from "@rollup/plugin-typescript";
import { eslint } from "rollup-plugin-eslint";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";

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
    eslint(),
    filesize(),
    terser()
  ]
};
