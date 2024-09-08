import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'
import { CreateUserInput } from './create-user.input'

export class UpdateUserInput extends PartialType(CreateUserInput) {
	@IsNotEmpty({ message: 'User id is required' })
	@IsInt({ message: 'User id must be an integer' })
	@ApiProperty({ description: 'User id', example: 3 })
	id: number
}
