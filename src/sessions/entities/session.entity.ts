export class Session {
	id: number
	userId: number
	refreshToken: string
	userAgent: string
	ip: string
	createdAt: Date
	revokedAt: Date
}
