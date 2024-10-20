import { ProjectType } from '@prisma/client'

export class TagsFilterInput {
	page?: number
	perPage?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
	search?: string
	projectType: ProjectType
}
