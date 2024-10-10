import { ProjectImage as PrismaProjectsImages } from '@prisma/client'
export class ProjectsImage implements PrismaProjectsImages {
	id: number
	title: string
	description: string
	url: string
	blueprintId: number
	bannerOf: number
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}
