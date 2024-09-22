import { Role } from '@core/roles/entities/role.entity'
import { User } from './user.entity'

export class ClearUser {
	id: number
	name: string
	discordId: string
	email: string
	avatar: string
	roleId: number
	role: Role
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
}
export function ClearUserFromUser(user: User): ClearUser {
	const clearUser = new ClearUser()
	clearUser.id = user.id
	clearUser.name = user.name
	clearUser.discordId = user.discordId
	clearUser.email = user.email
	clearUser.avatar = user.avatar
	clearUser.roleId = user.roleId
	clearUser.role = user.role
	clearUser.createdAt = user.createdAt
	clearUser.updatedAt = user.updatedAt
	clearUser.deletedAt = user.deletedAt
	return clearUser
}
