import {generateRuntimeData} from "@vipen/js-and-web-runtime/node"

import initLibraryProject from "./type/library/init.mjs"
import initPackageProject from "./type/package/init.mjs"
import buildSourceFile from "./fn/builder/sourceFile.mjs"

export async function initializeTarget(context) {
	context.target.data = {
		runtime_data: await generateRuntimeData(context.root)
	}

	switch (context.config.type) {
		case "library": {
			await initLibraryProject(context)

			// provide source as javascript module
			context.build.addFile(`source.mjs`, buildSourceFile, "library.mjs")
		} break

		case "package": {
			await initPackageProject(context)

			// provide source as javascript module
			context.build.addFile(`source.mjs`, buildSourceFile, "package.mjs")
			context.build.addFile(`source.min.mjs`, buildSourceFile, "package.min.mjs")
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
