import buildPackageFile from "./fn/builder/packageFile.mjs"
import buildTypesFile from "./fn/builder/typesFile.mjs"
import path from "node:path"
import {isRegularFile} from "@anio-node-foundation/fs-utils"

async function handleAdditionalEntryPoints(vipen_session, entry_points) {
	for (const output in entry_points) {
		const entry_point = entry_points[output]

		vipen_session.distributables.addFile(`additional_entry_points/${output}/package.mjs`, {
			generator: buildPackageFile,
			generator_args: [entry_point, false]
		})

		vipen_session.distributables.addFile(`additional_entry_points/${output}/package.min.mjs`, {
			generator: buildPackageFile,
			generator_args: [entry_point, true]
		})
	}
}

export default async function(vipen_session) {
	const project_config = vipen_session.getProjectConfig()

	vipen_session.distributables.addFile(`package.mjs`, {
		generator: buildPackageFile,
		generator_args: ["src/index.mjs", false]
	})

	vipen_session.distributables.addFile(`package.min.mjs`, {
		generator: buildPackageFile,
		generator_args: ["src/index.mjs", true]
	})

	const additional_entry_points = project_config?.target?.additional_entry_points

	if (additional_entry_points) {
		await handleAdditionalEntryPoints(vipen_session, additional_entry_points)
	}

	const types_path = path.join(vipen_session.getProjectRoot(), "src", "index.d.ts")

	if (!isRegularFile.sync(types_path)) {
		return
	}

	vipen_session.distributables.addFile(`index.d.ts`, {
		generator: buildTypesFile,
		generator_args: []
	})
}
