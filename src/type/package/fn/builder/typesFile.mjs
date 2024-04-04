import runBundler from "./../../../../fn/bundler/index.mjs"

export default async function(vipen_session) {
	return await runBundler(
		vipen_session, {
			entry: "src/index.d.ts",
			minified: false
		}
	)
}
