import { ProjectType } from '@prisma/client'

export class CreateCategoryDto {
	name: string
	icon: string
	projectType: ProjectType
}
