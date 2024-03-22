import { defineConfig } from "rollup";
// A Rollup plugin which locates modules using the Node resolution algorithm
import { nodeResolve } from "@rollup/plugin-node-resolve";
// A Rollup plugin to convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import commonjs from "@rollup/plugin-commonjs";
// Use the latest JS features in your Rollup bundle
import babel from "@rollup/plugin-babel";
// Minifies the bundle
import terser from "@rollup/plugin-terser";

import strip from "@rollup/plugin-strip";

// CSS
// Enable the PostCSS preprocessor
import postcss from "rollup-plugin-postcss";
import scss from "rollup-plugin-scss";

// Use @import to include other CSS files
import atImport from "postcss-import";
// Use the latest CSS features in your Rollup bundle
import postcssPresetEnv from "postcss-preset-env";
// PurgeCSS
import purgecss from "@fullhuman/postcss-purgecss";

// Development: Enables a livereload server that watches for changes to CSS, JS, and Handlbars files
import { resolve } from "path";
import livereload from "rollup-plugin-livereload";

// Rollup configuration
export default defineConfig({
  input: "assets/js/index.js",
  output: {
    dir: "assets/built",
    sourcemap: true,
    format: "iife",
    plugins: [terser()],
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({ babelHelpers: "bundled" }),
    postcss({
      use: ["sass"],
      extract: true,
      sourceMap: true,
      plugins: [atImport(), postcssPresetEnv({})],
      minimize: true,
      plugins: [
        purgecss({
          content: ["./**/*.hbs"],
          safelist: [/^gh-/, /^kg-/, "blockquote"],
        }),
      ],
    }),
    process.env.BUILD === "production" &&
      strip({
        functions: ["console.*"],
      }),
    process.env.BUILD !== "production" &&
      livereload({
        watch: resolve("."),
        extraExts: ["hbs"],
        exclusions: [resolve("node_modules")],
      }),
  ],
});
