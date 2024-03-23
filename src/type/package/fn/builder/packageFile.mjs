import runBundler from "./../../../../fn/bundler/index.mjs"

export default async function(file_path) {
	await runBundler(
		this, {
			entry: "src/index.mjs",
			output: "build/package.mjs"
		}
	)
}
