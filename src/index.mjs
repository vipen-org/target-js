import {generateRuntimeData} from "@vipen/js-and-web-runtime/node"

import initLibraryProject from "./type/library/init.mjs"
import initPackageProject from "./type/package/init.mjs"
import buildSourceFile from "./fn/builder/sourceFile.mjs"

export async function initialize(vipen_session) {
	const project_root = vipen_session.getProjectRoot()
	const project_config = vipen_session.getProjectConfig()

	vipen_session.target.data = {
		runtime_data: await generateRuntimeData(project_root)
	}

	switch (project_config.type) {
		case "package": {
			await initPackageProject(vipen_session)

			// provide source as javascript module
			vipen_session.distributables.addFile(`source.mjs`, {generator: buildSourceFile, generator_args: ["package.mjs"]})
			vipen_session.distributables.addFile(`source.min.mjs`, {generator: buildSourceFile, generator_args: ["package.min.mjs"]})
		} break

		case "library": {
			await initLibraryProject(vipen_session)

			// provide source as javascript module
			vipen_session.distributables.addFile(`source.mjs`, {generator: buildSourceFile, generator_args: ["library.mjs"]})
			vipen_session.distributables.addFile(`source.min.mjs`, {generator: buildSourceFile, generator_args: ["library.min.mjs"]})
		} break

		/*
		case "app": {
			//await initAppProject(context)
		} break

		case "class": {
			//await initClassProject(context)
		} break
		*/

		default: {
			throw new Error(
				`Unknown target type '${project_config.type}'.`
			)
		}
	}
}
