import { SimpleUser } from '@core/user/entity/simple_user.entity'
import {
	Blueprints as PrismaBlueprints,
	ProjectStatus,
	ProjectVisibility
} from '@prisma/client'

export class Blueprint implements PrismaBlueprints {
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
	fileUrl: string
	ownerId: number
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
	owner: SimpleUser
}
