import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { ProjectStatus } from '@prisma/client'
import { CreateBlueprintInput } from './create-blueprint.input'

@InputType()
export class UpdateBlueprintInput extends PartialType(CreateBlueprintInput) {
	@Field(() => Int)
	id: number

	@Field(() => String, {
		description: 'Name of the blueprint project',
		nullable: true
	})
	descriprion?: string

	@Field(() => ProjectStatus, {
		description: 'status of the project',
		nullable: true
	})
	status?: ProjectStatus

	@Field(() => String, {
		description: 'Icon of the project',
		nullable: true
	})
	icon?: string

	@Field(() => String, {
		description: 'Banner of the project',
		nullable: true
	})
	banner?: string

	@Field(() => String, {
		description: 'Category of the project',
		nullable: true
	})
	category?: string

	@Field(() => [String], {
		description: 'Tags of the project',
		nullable: true
	})
	tags?: string[]

	@Field(() => String, {
		description: 'File of the project',
		nullable: true
	})
	file?: string
}
