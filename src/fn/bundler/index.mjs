import process from "node:process"
import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import rollupPluginFactory from "./plugin.mjs"
import {generateTemporaryPathName} from "@anio-node-foundation/fs-utils"
import fs from "node:fs/promises"
import {dts} from "rollup-plugin-dts"

export default async function(vipen_session, options) {
	const cwd = process.cwd()

	//
	// needed for rollup-node-resolve plugin
	//
	process.chdir(vipen_session.getProjectRoot())

	const plugin = rollupPluginFactory(vipen_session)

	const rollup_plugins = options.entry.endsWith("d.ts") ? [dts({
		respectExternal: true
	})] : [plugin(), resolve()]

	if (options.minified) {
		rollup_plugins.push(terser())
	}

	const output_file_path = (await generateTemporaryPathName()) + ".mjs"

	const rollup_options = {
		input: options.entry,

		output: {
			file: output_file_path,
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
			vipen_session.addWarning("rollup", {message: `[${level}] rollup says ${error.message}`})
		}
	}

	try {
		const bundle = await rollup(rollup_options)

		await bundle.write(rollup_options.output)

		const bundle_code = (await fs.readFile(output_file_path)).toString()

		await fs.unlink(output_file_path)

		return bundle_code
	} finally {
		process.chdir(cwd)
	}
}
