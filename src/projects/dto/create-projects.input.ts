import { ApiProperty } from '@nestjs/swagger'
import { ProjectType, ProjectVisibility } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateProjectInput {
	@IsEnum(ProjectType)
	@IsNotEmpty({ message: 'Blueprint type is required' })
	@ApiProperty({
		description: 'Blueprint type',
		example: 'BLUEPRINT',
		enum: String
	})
	type: ProjectType

	@IsString()
	@IsNotEmpty({ message: 'Blueprint name is required' })
	@ApiProperty({ description: 'Blueprint name', example: 'My blueprint' })
	name: string

	@IsString()
	@IsNotEmpty({ message: 'Blueprint slug is required' })
	@ApiProperty({ description: 'Blueprint slug', example: 'my-blueprint' })
	slug: string

	@IsString()
	@IsNotEmpty({ message: 'Blueprint description is required' })
	@ApiProperty({
		description: 'Blueprint description',
		example: 'PUBLIC',
		type: String
	})
	visibility: ProjectVisibility
}
