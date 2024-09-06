import { User } from '@core/user/entities/user.entity'
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { ProjectStatus, ProjectVisibility } from '@prisma/client'

registerEnumType(ProjectStatus, {
	name: 'ProjectStatus',
	description: 'Status of the project'
})

registerEnumType(ProjectVisibility, {
	name: 'ProjectVisibility',
	description: 'Visibility of the project'
})

@ObjectType()
export class Blueprint {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	slug: string

	@Field()
	icon: string

	@Field()
	banner: string

	@Field()
	description: string

	@Field()
	category: string

	@Field(() => [String])
	tags: string[]

	@Field(() => ProjectVisibility)
	visibility: ProjectVisibility

	@Field(() => ProjectStatus)
	status: ProjectStatus

	@Field()
	owner: User

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date

	@Field()
	deletedAt: Date
}
