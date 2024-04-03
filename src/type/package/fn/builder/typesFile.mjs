import fs from "node:fs/promises"
import path from "node:path"

export default async function(vipen_session) {
	const types_file = path.join(vipen_session.getProjectRoot(), "src", "index.d.ts")

	return (await fs.readFile(types_file)).toString()
}
