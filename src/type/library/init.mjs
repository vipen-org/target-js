import getExportedLibraryFunctions from "./fn/getExportedLibraryFunctions.mjs"
import determineSubModules from "./fn/determineSubModules.mjs"

// autogenerators
import generateLibraryFile from "./fn/autogenerator/libraryFile.mjs"
import generateDictFile from "./fn/autogenerator/dictFile.mjs"
import generateImportWithContextFile from "./fn/autogenerator/importWithContextFile.mjs"
import generateIndexFile from "./fn/autogenerator/indexFile.mjs"
import generateSupportFile from "./fn/autogenerator/supportFile.mjs"

// builders
import buildLibraryFile from "./fn/builder/libraryFile.mjs"
import buildSubModuleFile from "./fn/builder/subModuleFile.mjs"

export default async function(context) {
	const library_functions = await getExportedLibraryFunctions(context)
	const sub_modules = determineSubModules(library_functions)

	context.autogenerate.addFile(`library.mjs`, generateLibraryFile, library_functions)
	context.autogenerate.addFile(`dict.mjs`, generateDictFile, library_functions)
	context.autogenerate.addFile(`importWithContext.mjs`, generateImportWithContextFile, library_functions)
	context.autogenerate.addFile(`index.mjs`, generateIndexFile, library_functions)

	for (const support_file of [
		"wrapFunction.mjs",
		"wrapFactory.mjs",
		"createModifierFunction.mjs",
		"createNamedAnonymousFunction.mjs"
	]) {
		context.autogenerate.addFile(`support_files/${support_file}`, generateSupportFile, support_file)
	}

	context.build.addFile(`library.mjs`, buildLibraryFile)
	context.build.addFile(`library.min.mjs`, buildLibraryFile, true)

	for (const sub_module of sub_modules) {
		context.build.addFile(`submodule/${sub_module}.mjs`, buildSubModuleFile, library_functions, sub_module)
	}

	//state.files.autogenerate.push(["NOTICE.txt", createNoticeFile, {autogen_warning_comment: false}])
	//state.files.autogenerate.push(["VERSION.txt", createVersionFile, {autogen_warning_comment: false}])
}
