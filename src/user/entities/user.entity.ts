import { Role } from '@core/roles/entities/role.entity'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
	@Field(() => Int, { description: 'User id' })
	id: number

	@Field({ description: 'User name' })
	name: string

	@Field({ description: 'User discord id' })
	discordId: string

	@Field({ description: 'User avatar url' })
	avatar: string

	@Field(() => Role, { description: 'User role' })
	role: Role

	@Field({ description: 'User refresh token' })
	refreshToken: string

	@Field({ description: 'User created at' })
	createdAt: Date

	@Field({ description: 'User updated at' })
	updatedAt: Date

	@Field({ description: 'User deleted at' })
	deletedAt: Date
}
