// Code is based off of https://rollupjs.org/plugin-development/#a-simple-example
import fs from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {createRequire} from "node:module"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

async function loadVirtualModule(context, js_runtime_data) {
	let virtual_module = ``

	virtual_module  = `const runtime_data = ` + JSON.stringify(context.target.data, null, 4) + ";\n"
	virtual_module += `import {initializeRuntimeFromData} from "@virt-vipen/js-and-web-runtime/bundle"\n`
	virtual_module += `const runtime = initializeRuntimeFromData(runtime_data);\n`

	for (const method of [
		"loadResource",
		"loadProjectPackageJSON",
		"loadVipenConfiguration",
		"createDefaultContext"
	]) {
		virtual_module += `export function ${method}(...args) { return runtime.${method}(...args); }\n`
	}

	return virtual_module
}

export default function(context, js_runtime_data) {
	return function anioJSBundlerResolverPlugin() {
		return {
			name: "vipen-js-runtime-plugin",

			resolveId(source) {
				if (source === "@vipen/target-js") {
					// this signals that Rollup should not ask other plugins or check
					// the file system to find this id
					return source
				} else if (source === "@virt-vipen/js-and-web-runtime/bundle") {
					return source
				}

				return null // other ids should be handled as usually
			},

			async load(id) {
				if (id === "@vipen/target-js") {
					return await loadVirtualModule(context, js_runtime_data)
				} else if (id === "@virt-vipen/js-and-web-runtime/bundle") {
					const runtime_bundle_path = fileURLToPath(import.meta.resolve("@vipen/js-and-web-runtime/bundle"))

					return (await fs.readFile(runtime_bundle_path)).toString()
				}

				return null // other ids should be handled as usually
			}
		}
	}
}
