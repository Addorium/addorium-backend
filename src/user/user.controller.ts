import { Permission } from '@core/auth/decorators/roles.decorator'
import { CurrentUser } from '@core/auth/decorators/user.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { PaginatedResult } from '@core/paginator'
import { RolesService } from '@core/roles/roles.service'
import { UploadsService } from '@core/uploads/uploads.service'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	NotFoundException,
	Param,
	Patch,
	Put,
	Query,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiTags
} from '@nestjs/swagger'
import { UpdateUaerAvatarDto } from './dto/update-avatar.input'
import { UpdateUserInput } from './dto/update-user.input'
import { UserFilterInput } from './dto/user-filter.input'
import { ClearUser } from './entity/clean_user.entity'
import { User } from './entity/user.entity'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly rolesService: RolesService
	) {}

	// find all users
	@Get()
	//@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ type: ClearUser, isArray: true })
	async findAll(
		@Query() userFilters: UserFilterInput
	): Promise<PaginatedResult<ClearUser>> {
		const users = await this.userService.getAll(userFilters)
		return users
	}

	// find me
	@Get('/me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ type: ClearUser })
	async findMe(@CurrentUser('id') userId: number): Promise<ClearUser> {
		const user = await this.userService.getById(userId.toString())
		delete user.refreshToken
		return user
	}

	// find user by id
	@Get(':id')
	// @UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ type: ClearUser })
	async findOne(
		// @CurrentUser('id') userId: number,
		@Param('id') id: number
	): Promise<ClearUser> {
		const user = await this.userService.getById(id.toString())
		delete user.refreshToken
		return user
	}

	// find user by discord id
	@Get('discord/:discordId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ type: ClearUser })
	async findByDiscordId(
		@Param('discordId') discordId: string
	): Promise<ClearUser> {
		const user = await this.userService.getByDiscordId(discordId)
		delete user.refreshToken
		return user
	}

	// update user by id
	@Put()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:user.update')
	@ApiBearerAuth()
	@ApiOkResponse({ type: ClearUser })
	async updateUser(
		@CurrentUser() user: User,
		@Body() updateUserInput: UpdateUserInput
	): Promise<ClearUser> {
		const hasAdminPermission = await this.rolesService.hasPermission(
			user.role.permissions,
			'admin:user.update'
		)
		const hasRoleChangePermission = await this.rolesService.hasPermission(
			user.role.permissions,
			'admin:user.update.role'
		)
		if (!hasRoleChangePermission && updateUserInput.roleId !== user.roleId) {
			throw new UnauthorizedException('Permission denied')
		}
		if (hasAdminPermission && updateUserInput.id !== user.id) {
			return await this.userService.update({ ...updateUserInput })
		} else if (updateUserInput.id !== user.id) {
			throw new UnauthorizedException('Permission denied')
		}
		const updatedUser = await this.userService.update({ ...updateUserInput })
		return updatedUser
	}

	// delete user by id
	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:users.delete')
	@ApiBearerAuth()
	@ApiOkResponse({ type: ClearUser })
	async removeUser(@Param('id') id: number): Promise<ClearUser> {
		const user = await this.userService.remove(+id)
		delete user.refreshToken
		return user
	}

	@Patch('avatar')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.imagesInterceptorOptions)
	)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:user.update.avatar')
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Upload user avatar',
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary'
				},
				id: {
					type: 'number'
				}
			}
		}
	})
	@ApiOkResponse({ type: ClearUser })
	async userAvatarUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body() updateUaerAvatarDto: UpdateUaerAvatarDto
	) {
		if (!file) {
			throw new NotFoundException('File not found')
		}
		const hasAdminPermission = await this.rolesService.hasPermission(
			user.role.permissions,
			'admin:user.update'
		)
		const userFromRequest = await this.userService.getById(
			updateUaerAvatarDto.id.toString()
		)
		if (hasAdminPermission && +updateUaerAvatarDto.id !== user.id) {
			return await this.userService.uploadAvatarImage(file, userFromRequest)
		} else if (+updateUaerAvatarDto.id !== user.id) {
			throw new HttpException('Permission denied', 403)
		}
		delete user.refreshToken
		return await this.userService.uploadAvatarImage(file, user)
	}
	@Delete('avatar/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:user.update.avatar')
	@ApiBearerAuth()
	@ApiOkResponse({ type: ClearUser })
	async userAvatarClear(@CurrentUser() user: User, @Param('id') id: number) {
		const hasAdminPermission = await this.rolesService.hasPermission(
			user.role.permissions,
			'admin:user.update'
		)
		const userFromRequest = await this.userService.getById(id.toString())
		if (hasAdminPermission && +id !== +user.id) {
			return await this.userService.clearAvatar(userFromRequest)
		} else if (+id !== +user.id) {
			throw new HttpException('Permission denied', 403)
		}
		return await this.userService.clearAvatar(user)
	}
}
