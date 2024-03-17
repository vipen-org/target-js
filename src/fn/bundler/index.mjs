import process from "node:process"
import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import rollupPluginFactory from "./plugin.mjs"

import path from "node:path"
import fs from "node:fs/promises"

/*
{
		// bundle id
		bundle_id: project.state.bundle.id.hash,
		short_bundle_id: project.state.bundle.id.short,
		// bundle.resources
		bundled_resources: project.state.bundle.resources,

		// bundler meta
		bundler_meta: project.meta,

		// project's package.json
		package_json: project.package_json,

		// anio_project.mjs config
		anio_project_config: project.config
	}
*/

export default async function(context, js_runtime_data, {entry, output}) {
	const plugin = rollupPluginFactory(context, js_runtime_data)

	const rollup_options = {
		input: entry,

		output: {
			file: output,
			format: "es"//,
			//inlineDynamicImports: true
		},

		//
		// custom plugin has the responsibility
		// to resolve "@vipen/target-js/runtime" to a ''virtual'' module
		// to support loading resources seamlessly
		//
		plugins: [plugin(), resolve()],

		onLog(level, error, handler) {
			print(
				`    [${level}] rollup says ${error.message}\n`
			)
		}
	}

	const cwd = process.cwd()

	//
	// needed for rollup-node-resolve plugin
	//
	process.chdir(context.root)

	try {
		const bundle = await rollup(rollup_options)

		await bundle.write(rollup_options.output)
	} finally {
		process.chdir(cwd)
	}
}
