import buildPackageFile from "./fn/builder/packageFile.mjs"
import buildTypesFile from "./fn/builder/typesFile.mjs"
import path from "node:path"
import {isRegularFile} from "@anio-node-foundation/fs-utils"

export default async function(vipen_session) {
	vipen_session.distributables.addFile(`package.mjs`, {
		generator: buildPackageFile,
		generator_args: [false]
	})

	vipen_session.distributables.addFile(`package.min.mjs`, {
		generator: buildPackageFile,
		generator_args: [true]
	})

	const types_path = path.join(vipen_session.getProjectRoot(), "src", "index.d.ts")

	if (!isRegularFile.sync(types_path)) {
		return
	}

	vipen_session.distributables.addFile(`index.d.ts`, {
		generator: buildTypesFile,
		generator_args: []
	})
}
