export class ProjectsFilterInput {
	page?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
	search?: string
	tags?: string[]
	categories?: string[]
}
