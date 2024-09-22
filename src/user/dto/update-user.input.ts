import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'
import { CreateUserInput } from './create-user.input'

export class UpdateUserInput extends PartialType(CreateUserInput) {
	@IsNotEmpty({ message: 'User id is required' })
	@IsInt({ message: 'User id must be an integer' })
	@ApiProperty({ description: 'User id', example: 3 })
	id: number

	@ApiProperty({
		description: 'User email',
		example: ''
	})
	email: string

	@ApiProperty({
		description: 'User password',
		example: ''
	})
	password: string

	@ApiProperty({
		description: 'User role id',
		example: 1
	})
	roleId: number
}
