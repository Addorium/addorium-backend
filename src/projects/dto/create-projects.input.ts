import { ApiProperty } from '@nestjs/swagger'
import { ProjectType, ProjectVisibility } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateProjectInput {
	@IsEnum(ProjectType)
	@IsNotEmpty({ message: 'Project type is required' })
	@ApiProperty({
		description: 'Project type',
		example: 'BLUEPRINT',
		enum: String
	})
	type: ProjectType

	@IsString()
	@IsNotEmpty({ message: 'Project name is required' })
	@ApiProperty({ description: 'Project name', example: 'My Project' })
	name: string

	@IsString()
	@IsNotEmpty({ message: 'Project description is required' })
	@ApiProperty({
		description: 'Project summary',
		example: 'My project summary',
		type: String
	})
	summary: string

	@IsString()
	@IsNotEmpty({ message: 'Project slug is required' })
	@ApiProperty({ description: 'Project slug', example: 'my-Project' })
	slug: string

	@IsString()
	@IsNotEmpty({ message: 'Project description is required' })
	@ApiProperty({
		description: 'Project description',
		example: 'PUBLIC',
		type: String
	})
	visibility: ProjectVisibility
}
