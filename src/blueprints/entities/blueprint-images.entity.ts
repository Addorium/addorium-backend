import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Blueprint } from './blueprint.entity'

@ObjectType()
export class BlueprintImage {
	@Field(() => Int)
	id: number

	@Field()
	title: string

	@Field()
	description: string

	@Field()
	url: string

	@Field()
	blueprint: Blueprint

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date

	@Field()
	deletedAt: Date
}
