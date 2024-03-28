import runBundler from "./../../../../fn/bundler/index.mjs"
import path from "node:path"

export default async function(file_path, minified = false) {
	await runBundler(
		this, {
			entry: "src/auto/library.mjs",
			output: path.join("build", file_path),
			minified
		}
	)
}
