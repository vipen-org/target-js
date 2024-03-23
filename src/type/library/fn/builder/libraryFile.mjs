import runBundler from "./../../../../fn/bundler/index.mjs"

export default async function(file_path) {
	await runBundler(
		this, {
			entry: "src/auto/library.mjs",
			output: "build/library.mjs"
		}
	)
}
