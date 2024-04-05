/**
 * @brief Get runtime version number
 */
export function getRuntimeVersion() : string

interface LoadResourceFunction {
	/**
	 * @brief Synchronously load a resource
	 * @description
	 * Synchronously load the resource at `url`.
	 * @param url URL of the resource.
	 * @return
	 * The resources content.
	 */
	(url : string) : string | Uint8Array

	/**
	 * @brief Synchronously load a resource
	 * @description
	 * Synchronously load the resource at `url`.
	 * @param url URL of the resource.
	 * @return
	 * URL that points to the loaded resource.
	 */
	asURL(url : string) : string
}

export var loadResource : LoadResourceFunction

/**
 * @brief Synchronously load the project's package.json
 */
export function loadProjectPackageJSON() : object

/**
 * @brief Synchronously load the project's vipen configuration
 */
export function loadVipenConfiguration() : object

export function createDefaultContext() : object
