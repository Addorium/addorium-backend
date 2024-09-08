import { Role } from '@core/roles/entities/role.entity'
import { ApiProperty } from '@nestjs/swagger'
import { User as PrismaUser } from '@prisma/client'

export class User implements PrismaUser {
	@ApiProperty({ description: 'User id' })
	id: number

	@ApiProperty({ description: 'User name' })
	name: string

	@ApiProperty({ description: 'User discord id' })
	discordId: string

	@ApiProperty({ description: 'User avatar url' })
	avatar: string

	@ApiProperty({ description: 'User role' })
	roleId: number

	@ApiProperty({ description: 'User role' })
	role: Role

	@ApiProperty({ description: 'User refresh token' })
	refreshToken: string

	@ApiProperty({ description: 'User created at' })
	createdAt: Date

	@ApiProperty({ description: 'User updated at' })
	updatedAt: Date

	@ApiProperty({ description: 'User deleted at' })
	deletedAt: Date | null
}
