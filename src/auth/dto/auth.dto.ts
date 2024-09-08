import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {
	@ApiProperty({ description: 'Discord Oauth2 code', example: '1234567890' })
	code: string
}
