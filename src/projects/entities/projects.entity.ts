import { SimpleUser } from '@core/user/entity/simple_user.entity'
import { ProjectStatus, ProjectVisibility } from '@prisma/client'

export class Project {
	id: number
	name: string
	slug: string
	visibility: ProjectVisibility
	status: ProjectStatus
	icon: string
	banner: string
	description: string
	category: string
	tags: string[]
	fileUrl?: string
	ownerId: number
	owner?: SimpleUser
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}
