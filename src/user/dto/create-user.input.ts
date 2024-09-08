import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserInput {
	@ApiProperty({ description: 'User name', example: 'John Doe' })
	@IsString()
	@MaxLength(30, { message: 'Name is too long' })
	@MinLength(3, { message: 'Name is too short' })
	name: string

	@ApiProperty({ description: 'Discord id', example: '1234567890' })
	@IsString()
	discordId: string

	@ApiProperty({
		description: 'User avatar',
		example: 'https://example.com/avatar.png'
	})
	@IsString()
	avatar: string

	@ApiProperty({ description: 'User refresh token', example: '1234567890' })
	refreshToken: string
}
