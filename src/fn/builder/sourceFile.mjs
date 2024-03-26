import path from "node:path"
import fs from "node:fs/promises"

export default async function(file_path, source_file_path) {
	const destination_path = path.join(this.root, "build", file_path)
	const source_code = await fs.readFile(path.join(this.root, "build", source_file_path))

	let code = `const source_code = JSON.parse(${JSON.stringify(JSON.stringify(source_code.toString()))});\n\n`
	code += `export default source_code;\n`

	await fs.writeFile(`${destination_path}.tmp`, code)
	await fs.rename(`${destination_path}.tmp`, destination_path)
}
