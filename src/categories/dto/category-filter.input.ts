import { ProjectType } from '@prisma/client'

export class CategoryFilterInput {
	page?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
	search?: string
	projectType: ProjectType
}
