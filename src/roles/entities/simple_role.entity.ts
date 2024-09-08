import { Role } from './role.entity'

export class SimpleRole {
	id: number
	name: string
	permissions: string[]
}

export function SimpleRoleFromRole(role: Role): SimpleRole {
	const simpleRole = new SimpleRole()
	simpleRole.id = role.id
	simpleRole.name = role.name
	simpleRole.permissions = role.permissions
	return simpleRole
}
