import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
	@Field({ description: 'User name' })
	name: string

	@Field({ description: 'User discord id' })
	discordId: string

	@Field({ description: 'User avatar url' })
	avatar: string

	@Field({ description: 'User refresh token' })
	refreshToken: string
}
