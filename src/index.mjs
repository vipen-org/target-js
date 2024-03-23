import {generateRuntimeData} from "@vipen/js-and-web-runtime/node"

import initLibraryProject from "./type/library/init.mjs"

export async function initializeTarget(context) {
	context.target.data = await generateRuntimeData(context.root)

	switch (context.type) {
		case "library": {
			await initLibraryProject(context)
		} break

		case "app": {
			//await initAppProject(context)
		} break

		case "package": {
			//await initPackageProject(context)
		} break

		case "class": {
			//await initClassProject(context)
		} break

		default: {
			throw new Error(
				`Unknown target type '${context.type}'.`
			)
		}
	}
}
