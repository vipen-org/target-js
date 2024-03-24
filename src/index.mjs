import {generateRuntimeData} from "@vipen/js-and-web-runtime/node"

import initLibraryProject from "./type/library/init.mjs"
import initPackageProject from "./type/package/init.mjs"

export async function initializeTarget(context) {
	context.target.data = {
		runtime_data: await generateRuntimeData(context.root)
	}

	switch (context.config.type) {
		case "library": {
			await initLibraryProject(context)
		} break

		case "package": {
			await initPackageProject(context)
		} break

		case "app": {
			//await initAppProject(context)
		} break

		case "class": {
			//await initClassProject(context)
		} break

		default: {
			throw new Error(
				`Unknown target type '${context.config.type}'.`
			)
		}
	}
}
