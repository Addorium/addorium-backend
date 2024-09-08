import { ApiProperty } from '@nestjs/swagger'

export class UpdateUaerAvatarDto {
	@ApiProperty({ description: 'User id', example: 3 })
	id: number
}
