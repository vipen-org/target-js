// Code is based off of https://rollupjs.org/plugin-development/#a-simple-example
import fs from "node:fs/promises"
import {fileURLToPath} from "node:url"

async function loadVirtualModule(context) {
	let virtual_module = ``

	virtual_module  = `const runtime_data = ` + JSON.stringify(context.target.data.runtime_data, null, 4) + ";\n"
	virtual_module += `import {initializeRuntimeFromData} from "@virt-vipen/js-and-web-runtime/bundle"\n`
	virtual_module += `const runtime = initializeRuntimeFromData(runtime_data);\n`

	const runtime_methods = [
		"getRuntimeVersion",
		"loadResource",
		"loadProjectPackageJSON",
		"loadVipenConfiguration",
		"createDefaultContext"
	]

	for (const method of runtime_methods) {
		virtual_module += `export function ${method}(...args) { return runtime.${method}(...args); }\n`
	}

	virtual_module += `export default {\n`

	for (const method of runtime_methods) {
		virtual_module += `    ${method},\n`
	}

	virtual_module += `}\n`

	return virtual_module
}

export default function(context) {
	return function VipenJsRuntimePlugin() {
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
					return await loadVirtualModule(context)
				} else if (id === "@virt-vipen/js-and-web-runtime/bundle") {
					const runtime_bundle_path = fileURLToPath(import.meta.resolve("@vipen/js-and-web-runtime/bundle"))

					return (await fs.readFile(runtime_bundle_path)).toString()
				}

				return null // other ids should be handled as usually
			}
		}
	}
}
