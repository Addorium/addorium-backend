import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'
import { CreateRoleInput } from './create-role.input'

export class UpdateRoleInput extends PartialType(CreateRoleInput) {
	@IsNotEmpty({ message: 'Role id is required' })
	@IsInt({ message: 'Role id must be an integer' })
	@ApiProperty({ description: 'Role id', example: 3 })
	id: number
}
