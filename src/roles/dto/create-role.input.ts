import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateRoleInput {
	@Field({ description: 'Role name' })
	name: string

	@Field(() => [String], { description: 'Role permissions' })
	permissions: string[]
}
