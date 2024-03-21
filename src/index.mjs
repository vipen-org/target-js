import {generateRuntimeData} from "@vipen/js-and-web-runtime/node"

import initLibraryProject from "./type/library/init.mjs"

export async function initializeTarget(context) {
	context.target.data = await generateRuntimeData(context.root)

	switch (context.type) {
		case "library": {
			await initLibraryProject(context)
		} break
	}
}
