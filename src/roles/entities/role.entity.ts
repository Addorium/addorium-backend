import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Role {
	@Field(() => Int, { description: 'Role id' })
	id: number

	@Field({ description: 'Role name' })
	name: string

	@Field(() => [String], { description: 'Role permissions' })
	permissions: string[]

	@Field({ description: 'Role created at' })
	createdAt: Date

	@Field({ description: 'Role updated at' })
	updatedAt: Date

	@Field({ description: 'Role deleted at' })
	deletedAt: Date
}
