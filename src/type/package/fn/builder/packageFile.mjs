import runBundler from "./../../../../fn/bundler/index.mjs"

export default async function(vipen_session, file_path, entry_point, minified = false) {
	return await runBundler(
		vipen_session, {
			entry: entry_point,
			minified
		}
	)
}
