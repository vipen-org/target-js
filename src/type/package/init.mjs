import buildPackageFile from "./fn/builder/packageFile.mjs"

export default async function(context) {
	context.build.addFile(`package.mjs`, buildPackageFile)
}
