// Code is based off of https://rollupjs.org/plugin-development/#a-simple-example
import fs from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {createRequire} from "node:module"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

async function loadVirtualModule(context, js_runtime_data) {
	const js_runtime_data_str = JSON.stringify(JSON.stringify(js_runtime_data))

	const require = createRequire(`${context.root}/index.js`)

	const runtime_path = require.resolve(`@vipen/target-js/runtime/dist/virtual.mjs`)

	let virtual_module = (
		await fs.readFile(runtime_path)
	).toString()

	virtual_module = virtual_module.split("`$build_context$`")
	virtual_module = virtual_module.join(js_runtime_data_str)

	return virtual_module
}

export default function(context, js_runtime_data) {
	return function anioJSBundlerResolverPlugin() {
		return {
			name: "vipen-js-runtime-plugin",

			resolveId(source) {
				if (source === "@vipen/target-js/runtime") {
					// this signals that Rollup should not ask other plugins or check
					// the file system to find this id
					return source
				}

				return null // other ids should be handled as usually
			},

			async load(id) {
				if (id === "@vipen/target-js/runtime") {
					return await loadVirtualModule(context, js_runtime_data)
				}

				return null // other ids should be handled as usually
			}
		}
	}
}
