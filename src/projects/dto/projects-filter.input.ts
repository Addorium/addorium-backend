import { ProjectStatus } from '@prisma/client'

export class ProjectsFilterInput {
	page?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
	projectStatus?: ProjectStatus
	search?: string
	tags?: string[]
	categories?: string[]
}
