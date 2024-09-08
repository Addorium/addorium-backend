import {
	SimpleRole,
	SimpleRoleFromRole
} from '@core/roles/entities/simple_role.entity'
import { User } from './user.entity'

export class SimpleUser {
	id: number
	name: string
	discordId: string
	avatar: string
	role: SimpleRole
}

export function SimpleUserFromUser(user: User): SimpleUser {
	const simpleUser = new SimpleUser()
	simpleUser.id = user.id
	simpleUser.name = user.name
	simpleUser.discordId = user.discordId
	simpleUser.avatar = user.avatar
	simpleUser.role = SimpleRoleFromRole(user.role)
	return simpleUser
}
