import buildPackageFile from "./fn/builder/packageFile.mjs"

export default async function(vipen_session) {
	vipen_session.distributables.addFile(`package.mjs`, {
		generator: buildPackageFile,
		generator_args: [false]
	})

	vipen_session.distributables.addFile(`package.min.mjs`, {
		generator: buildPackageFile,
		generator_args: [true]
	})
}
