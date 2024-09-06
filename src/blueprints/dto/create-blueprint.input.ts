import { Field, InputType } from '@nestjs/graphql'
import { ProjectVisibility } from '@prisma/client'

@InputType()
export class CreateBlueprintInput {
	@Field(() => String, { description: 'Name of the blueprint project' })
	name: string

	@Field(() => String, { description: 'Slug link for project' })
	slug: string

	@Field(() => ProjectVisibility, { description: 'Visibility of the project' })
	visibility: ProjectVisibility
}
