import runBundler from "./../../../../fn/bundler/index.mjs"

export default async function(file_path, js_runtime_data) {
	console.log(file_path, js_runtime_data)

	await runBundler(
		this, js_runtime_data, {
			entry: "src/auto/library.mjs",
			output: "build/library.mjs"
		}
	)
}
