import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
// import { NgmiPolyfill } from "vite-plugin-ngmi-polyfill"
// import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), /*NgmiPolyfill()*/],
	define: {
		"process.env": process.env ?? {},
	},
	resolve: {
		alias: [{
			find: "@",
			replacement: path.resolve(__dirname, "/src"),
			// sys: 'util',
			// crypto: "crypto-browserify",
		}],
	},
	build: {
		chunkSizeWarningLimit: 2000,
		target: "esnext",
		// rollupOptions: {
		//   plugins: [
		//      rollupNodePolyFill()
		//   ]
		// }
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
			// define: {
			//     global: 'globalThis'
			// },
			// plugins: [
			//   NodeGlobalsPolyfillPlugin({
			//       process: true,
			//       buffer: true
			//   }),
			// 	NodeModulesPolyfillPlugin()
			// ]
		}
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json", "./tsconfig.node.json"],
		tsconfigRootDir: __dirname,
	},
});
