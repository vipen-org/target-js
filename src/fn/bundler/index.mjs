import process from "node:process"
import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import rollupPluginFactory from "./plugin.mjs"

export default async function(context, options) {
	const {entry, output, minified} = options
	const cwd = process.cwd()

	//
	// needed for rollup-node-resolve plugin
	//
	process.chdir(context.root)

	const plugin = rollupPluginFactory(context)

	const rollup_plugins = [plugin(), resolve()]

	if (minified) {
		rollup_plugins.push(terser())
	}

	const rollup_options = {
		input: entry,

		output: {
			file: output,
			format: "es"//,
			//inlineDynamicImports: true
		},

		//
		// custom plugin has the responsibility
		// to resolve "@vipen/target-js" to a ''virtual'' module
		// to support loading resources seamlessly
		//
		plugins: rollup_plugins,

		onLog(level, error, handler) {
			context.warnings.push({
				id: "rollup",
				message: `[${level}] rollup says ${error.message}`
			})
		}
	}

	try {
		const bundle = await rollup(rollup_options)

		await bundle.write(rollup_options.output)
	} finally {
		process.chdir(cwd)
	}
}
