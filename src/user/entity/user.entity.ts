import { Role } from '@core/roles/entities/role.entity'
import { User as PrismaUser } from '@prisma/client'

export class User implements PrismaUser {
	id: number

	name: string

	discordId: string

	email: string

	emailVerified: Date | null

	password: string

	avatar: string

	roleId: number

	role: Role

	refreshToken: string

	createdAt: Date

	updatedAt: Date

	deletedAt: Date | null
}
