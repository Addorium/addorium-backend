import { ProjectStatus, ProjectType } from '@prisma/client'

export class ProjectsFilterInput {
	page?: number
	perPage?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
	projectStatus?: ProjectStatus
	search?: string
	tags?: string[]
	categories?: string[]
}
export class ProjectsFilterAllInput {
	page?: number
	projectType?: ProjectType
	perPage?: number
	orderBy?: string
	search?: string
	tags?: string[]
	categories?: string[]
}
