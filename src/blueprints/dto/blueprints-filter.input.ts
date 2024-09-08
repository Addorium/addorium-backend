export class BlueprintsFilterInput {
	page?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
	search?: string
	tags?: string[]
	categories?: string[]
}
