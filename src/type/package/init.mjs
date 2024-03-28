import buildPackageFile from "./fn/builder/packageFile.mjs"

export default async function(context) {
	context.build.addFile(`package.mjs`, buildPackageFile)
	context.build.addFile(`package.min.mjs`, buildPackageFile, true)
}
