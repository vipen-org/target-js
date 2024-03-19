import searchForProjectResources from "./fn/searchForProjectResources.mjs"

import initLibraryProject from "./type/library/init.mjs"

export async function initializeTarget(context) {
	context.target.data = {
		resources: await searchForProjectResources(context)
	}

	switch (context.type) {
		case "library": {
			await initLibraryProject(context)
		} break
	}
}
