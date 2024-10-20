import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ProjectStatus } from '@prisma/client'
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CreateProjectInput } from './create-projects.input'

export class UpdateProjectInput extends PartialType(CreateProjectInput) {
	@ApiProperty({ description: 'Id of the blueprint project' })
	@IsInt({ message: 'Id must be an integer' })
	@IsNotEmpty({ message: 'Id is required' })
	@ApiProperty({ description: 'Id of the project', example: 1 })
	id: number

	@ApiProperty({ description: 'Descriprion of the project' })
	@IsString()
	@ApiProperty({
		description: 'Descriprion of the project',
		example: 'This is my project',
		required: false
	})
	description?: string

	@ApiProperty({ description: 'Status of the project' })
	@IsString()
	@ApiProperty({
		description: 'Status of the project',
		example: 'draft',
		required: false
	})
	status?: ProjectStatus

	@ApiProperty({ description: 'Icon of the project' })
	@IsString()
	@ApiProperty({
		description: 'Icon of the project',
		example: 'icon',
		required: false
	})
	icon?: string

	@ApiProperty({ description: 'Banner of the project' })
	@IsNumber()
	@ApiProperty({
		description: 'Banner of the project',
		example: 'banner',
		required: false
	})
	bannerId?: number

	@ApiProperty({ description: 'Category of the project' })
	@IsString()
	@ApiProperty({
		description: 'Category of the project',
		example: 'category',
		required: false
	})
	categoryId?: number

	@ApiProperty({ description: 'Tags of the project' })
	@IsString({ each: true })
	@ApiProperty({
		description: 'Tags of the project',
		example: ['tag1', 'tag2'],
		required: false
	})
	tags?: number[]

	@ApiProperty({ description: 'File of the project' })
	@IsString()
	@ApiProperty({
		description: 'File of the project',
		example: 'file',
		required: false
	})
	file?: string
}
