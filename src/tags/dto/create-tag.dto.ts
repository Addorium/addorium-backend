import { ProjectType } from '@prisma/client'
import {
	IsEnum,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

export class CreateTagDto {
	@IsString()
	@MaxLength(30)
	@MinLength(3)
	name: string

	@IsOptional()
	icon?: string

	@IsEnum(ProjectType)
	projectType: ProjectType
}
