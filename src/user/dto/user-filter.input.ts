export class UserFilterInput {
	page?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
	search?: string
	roleId?: number
}
