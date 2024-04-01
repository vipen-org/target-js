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

export default async function(vipen_session) {
	const library_functions = await getExportedLibraryFunctions(vipen_session)
	const sub_modules = determineSubModules(library_functions)

	vipen_session.autogenerate.addFile(`library.mjs`, {
		generator: generateLibraryFile,
		generator_args: [library_functions]
	})

	vipen_session.autogenerate.addFile(`dict.mjs`, {
		generator: generateDictFile,
		generator_args: [library_functions]
	})

	vipen_session.autogenerate.addFile(`importWithContext.mjs`, {
		generator: generateImportWithContextFile,
		generator_args: [library_functions]
	})

	vipen_session.autogenerate.addFile(`index.mjs`, {
		generator: generateIndexFile,
		generator_args: [library_functions]
	})

	for (const support_file of [
		"wrapFunction.mjs",
		"wrapFactory.mjs",
		"createModifierFunction.mjs",
		"createNamedAnonymousFunction.mjs"
	]) {
		vipen_session.autogenerate.addFile(`support_files/${support_file}`, {
			generator: generateSupportFile,
			generator_args: [support_file]
		})
	}

	vipen_session.distributables.addFile(`library.mjs`, {
		generator: buildLibraryFile,
		generator_args: []
	})

	vipen_session.distributables.addFile(`library.min.mjs`, {
		generator: buildLibraryFile,
		generator_args: [true]
	})

	for (const sub_module of sub_modules) {
		vipen_session.distributables.addFile(`submodule/${sub_module}.mjs`, {
			generator: buildSubModuleFile,
			generator_args: [library_functions, sub_module]
		})
	}

	/*
	//state.files.autogenerate.push(["NOTICE.txt", createNoticeFile, {autogen_warning_comment: false}])
	//state.files.autogenerate.push(["VERSION.txt", createVersionFile, {autogen_warning_comment: false}])
	*/
}
