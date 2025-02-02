export async function hasPermission(
	userPermissions: string[],
	requiredPermission: string
): Promise<boolean> {
	const permissionParts = requiredPermission.split('.')
	const permissionModificator = permissionParts[0].split(':')[0]
	permissionParts[0] = permissionParts[0].split(':')[1]
	for (const userPermission of userPermissions) {
		const userPermissionParts = userPermission.split('.')
		const result = matchPermissionParts(
			userPermissionParts,
			permissionParts,
			permissionModificator
		)
		if (result) {
			return true
		}
	}
	return false
}

function matchPermissionParts(
	userPermissionParts: string[],
	permissionParts: string[],
	permissionModificator: string
): boolean {
	const userModificator = userPermissionParts[0].split(':')[0]
	userPermissionParts[0] = userPermissionParts[0].split(':')[1]

	if (userModificator === 'user' && permissionModificator === 'admin') {
		return false
	}

	if (userPermissionParts.length > permissionParts.length) {
		return false
	}

	for (let i = 0; i < userPermissionParts.length; i++) {
		if (userPermissionParts[i] === '*') {
			continue
		}
		if (userPermissionParts[i] !== permissionParts[i]) {
			return false
		}
	}
	return true
}
