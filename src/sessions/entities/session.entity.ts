export class Session {
	id: number
	userId: number
	refreshToken: string
	os: string
	platform: string
	city: string
	country: string
	userAgent: string
	ip: string
	createdAt: Date
	revokedAt: Date
}
