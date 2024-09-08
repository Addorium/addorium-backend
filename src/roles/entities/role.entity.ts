import { ApiProperty } from '@nestjs/swagger'
import { Role as PrismaRole } from '@prisma/client'

export class Role implements PrismaRole {
	@ApiProperty({ description: 'Role id' })
	id: number

	@ApiProperty({ description: 'Role name' })
	name: string

	@ApiProperty({ description: 'Role permissions' })
	permissions: string[]

	@ApiProperty({ description: 'Role created at' })
	createdAt: Date

	@ApiProperty({ description: 'Role updated at' })
	updatedAt: Date

	@ApiProperty({ description: 'Role deleted at' })
	deletedAt: Date
}
