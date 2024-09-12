import { Role as PrismaRole } from '@prisma/client'

export class Role implements PrismaRole {
	id: number
	name: string
	permissions: string[]
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}
