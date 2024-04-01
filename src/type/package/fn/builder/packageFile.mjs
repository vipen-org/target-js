import runBundler from "./../../../../fn/bundler/index.mjs"

export default async function(vipen_session, file_path, minified = false) {
	return await runBundler(
		vipen_session, {
			entry: "src/index.mjs",
			minified
		}
	)
}
