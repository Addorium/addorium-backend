import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateRoleInput {
	@IsNotEmpty({ message: 'Role name is required' })
	@ApiProperty({ description: 'Role name', example: 'user' })
	name: string

	@IsNotEmpty({ each: true, message: 'Role permissions are required' })
	@ApiProperty({
		description: 'Role permissions',
		example: ['user:user.update', 'user:user.create']
	})
	permissions: string[]
}
