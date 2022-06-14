import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from 'rollup-plugin-postcss';
import json from "@rollup/plugin-json";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  external: [
    "react",
    "react-dom"
  ],
  plugins: [
    postcss({
      plugins: [],
      minimize: true
    }),
    babel({
      exclude: "node_modules/**",
      babelHelpers: 'bundled'
    }),
    resolve(),
    commonjs(),
    json()
  ]
};
