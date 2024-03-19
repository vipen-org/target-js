import initLibraryProject from "./type/library/init.mjs"

export async function initializeTarget(context) {
	switch (context.type) {
		case "library": {
			await initLibraryProject(context)
		} break
	}
}
