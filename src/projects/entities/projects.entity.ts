import { Category } from '@core/categories/entities/category.entity'
import { ProjectImage } from '@core/gallery/entity/gallery.entity'
import { Tag } from '@core/tags/entities/tag.entity'
import { SimpleUser } from '@core/user/entity/simple_user.entity'
import { ProjectStatus, ProjectVisibility } from '@prisma/client'

export class Project {
	id: number
	name: string
	summary: string
	slug: string
	visibility: ProjectVisibility
	status: ProjectStatus
	galleryImages: ProjectImage[]
	icon: string
	bannerId: number
	banner: Exclude<ProjectImage, 'bannerOf'>
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
