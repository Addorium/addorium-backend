import { Category } from '@core/categories/entities/category.entity'
import { Tag } from '@core/tags/entities/tag.entity'
import { SimpleUser } from '@core/user/entity/simple_user.entity'
import { ProjectImage, ProjectStatus, ProjectVisibility } from '@prisma/client'

export class Project {
	id: number
	name: string
	slug: string
	visibility: ProjectVisibility
	status: ProjectStatus
	icon: string
	bannerId: number
	banner: ProjectImage
	description: string
	categoryId: number
	category: Category
	tags: Tag[]
	fileUrl?: string
	ownerId: number
	owner?: SimpleUser
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}
