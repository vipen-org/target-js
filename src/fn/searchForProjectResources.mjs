import path from "node:path"
import fs from "node:fs/promises"
import {isRegularDirectory} from "@anio-node-foundation/fs-utils"
import scandir from "@anio-node-foundation/fs-scandir"
import bundler from "../exports/bundler/index.mjs"

async function bundleUpResource(context, type, relative_path) {
	if (type === "esmodule") {
		return await bundler(context.root, relative_path)
	} else if (type === "text") {
		const absolute_path = path.join(context.root, "resources", "text", relative_path)

		return (await fs.readFile(absolute_path)).toString()
	} else {
		const absolute_path = path.join(context.root, "resources", "blob", relative_path)

		return (await fs.readFile(absolute_path)).toString("base64")
	}
}

export default async function(context) {
	const project_resources_path = path.join(context.root, "resources")

	if (!isRegularDirectory.sync(project_resources_path)) {
		return []
	}

	let resources = []

	const entries = await scandir(project_resources_path)

	for (const entry of entries) {
		if (entry.type !== "file") continue

		const tmp = entry.relative_path.split("/")

		if (tmp.length === 1) continue

		const resource_type = tmp.shift()
		const relative_path = tmp.join("/")

		if (!(["esmodule", "text", "blob"].includes(resource_type))) continue

		resources.push({
			type: resource_type,
			relative_path,
			resource: await bundleUpResource(context, resource_type, relative_path)
		})
	}

	resources.sort((a, b) => {
		let a_str = `${a.type}:/${a.relative_path}`
		let b_str = `${b.type}:/${b.relative_path}`

		return a_str.localeCompare(b_str, "en")
	})

	return resources
}
