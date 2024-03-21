import {generateRuntimeData} from "@vipen/js-and-web-runtime/node"
import {initializeRuntimeFromData} from "@vipen/js-and-web-runtime"
import nodeFsFindNearestFile from "@anio-node-foundation/fs-find-nearest-file"

import process from "node:process"
import path from "node:path"

const vipen_config_path = await nodeFsFindNearestFile("vipen.config.mjs", path.dirname(process.argv[1]))

if (!vipen_config_path) {
	throw new Error(
		`Unable to locate vipen.config.mjs file. Are you sure it is present in the project root?`
	)
}

const project_root = path.dirname(vipen_config_path)

const runtime_data = await generateRuntimeData(project_root)
const runtime = initializeRuntimeFromData(runtime_data)

//
// provide named exports for runtime methods
//
export function loadResource(...args) { return runtime.loadResource(...args); }
export function loadProjectPackageJSON() { return runtime.loadProjectPackageJSON(); }
export function loadVipenConfiguration() { return runtime.loadVipenConfiguration(); }
export function createDefaultContext() { return runtime.createDefaultContext(); }

export default {
	loadResource,
	loadProjectPackageJSON,
	loadVipenConfiguration
}
