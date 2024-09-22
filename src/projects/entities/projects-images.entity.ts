import { ProjectsImages as PrismaProjectsImages } from '@prisma/client'
export class ProjectsImage implements PrismaProjectsImages {
	id: number

	title: string

	description: string

	url: string

	blueprintId: number

	createdAt: Date

	updatedAt: Date

	deletedAt: Date
}
