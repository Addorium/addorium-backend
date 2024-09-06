import { Permission } from '@core/auth/decorators/roles.decorator'
import { CurrentUser } from '@core/auth/decorators/user.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { RolesService } from '@core/roles/roles.service'
import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private readonly rolesService: RolesService
	) {}

	// find all users
	@Query(() => [User], { name: 'users' })
	@UseGuards(JwtAuthGuard)
	async findAll() {
		return await this.userService.getAll()
	}

	// find user by id
	@Query(() => User, { name: 'user' })
	async findOne(@Args('id', { type: () => Int }) id: number) {
		return await this.userService.getById(id)
	}
	@Query(() => User, { name: 'me' })
	@UseGuards(JwtAuthGuard)
	async findMe(@CurrentUser() user: User) {
		return user
	}

	// find user by discord id
	@Query(() => User, { name: 'userByDiscordId' })
	async findByDiscordId(@Args('discordId') discordId: string) {
		return await this.userService.getByDiscordId(discordId)
	}

	// update user by id
	@Mutation(() => User)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:user.update')
	async updateUser(
		@CurrentUser() user: User,
		@Args('updateUserInput') updateUserInput: UpdateUserInput
	) {
		const hasAdminPermission = await this.rolesService.hasPermission(
			user.role.permissions,
			'admin:user.update'
		)
		if (hasAdminPermission && updateUserInput.id !== user.id) {
			return await this.userService.update({ ...updateUserInput })
		} else if (updateUserInput.id !== user.id) {
			throw new Error('Permission denied')
		}
		return await this.userService.update({ ...updateUserInput, id: user.id })
	}

	// delete user by id
	@Mutation(() => User)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:users.delete')
	async removeUser(@Args('id', { type: () => Int }) id: number) {
		return await this.userService.remove(id)
	}

	// update user avatar by id
	@Mutation(() => User)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:user.update.avatar')
	async updateUserAvatar(
		@CurrentUser() user: User,
		@Args('avatar') avatar: string,
		@Args('id', { type: () => Int }) userId: number
	) {
		const hasAdminPermission = await this.rolesService.hasPermission(
			user.role.permissions,
			'admin:user.update.avatar'
		)
		if (hasAdminPermission && userId !== user.id) {
			return await this.userService.updateUaerAvatar(userId, avatar)
		} else if (userId !== user.id) {
			throw new Error('Permission denied')
		}
		return await this.userService.updateUaerAvatar(userId, avatar)
	}
}
