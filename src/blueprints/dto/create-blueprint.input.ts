import { ApiProperty } from '@nestjs/swagger'
import { ProjectVisibility } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateBlueprintInput {
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
