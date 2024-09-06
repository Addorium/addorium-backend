import { Permission } from '@core/auth/decorators/roles.decorator'
import { CurrentUser } from '@core/auth/decorators/user.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { RolesService } from '@core/roles/roles.service'
import { User } from '@core/user/entities/user.entity'
import {
	Body,
	Controller,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadsService } from './uploads.service'

@Controller('uploads')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UploadsController {
	constructor(
		private readonly uploadsService: UploadsService,
		private readonly rolesService: RolesService
	) {}

	private static fileFilter(req, file, callback) {
		if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
			return callback(new Error('Only image files are allowed!'), false)
		}
		callback(null, true)
	}

	private static fileInterceptorOptions = {
		fileFilter: UploadsController.fileFilter,
		limits: { fileSize: 1024 * 1024 * 10, files: 1 }
	}

	@Post('images/user/avatar')
	@UseInterceptors(
		FileInterceptor('file', UploadsController.fileInterceptorOptions)
	)
	@Permission('users:user.update.avatar')
	async userAvatarUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body('user_id') user_id: string
	) {
		const hasAdminPermission = await this.rolesService.hasPermission(
			user.role.permissions,
			'admin:user.update'
		)
		if (hasAdminPermission && +user_id !== user.id) {
			return await this.uploadsService.uploadImage(
				user,
				file,
				user_id,
				'avatar',
				'user'
			)
		} else if (+user_id !== user.id) {
			throw new Error('Permission denied')
		}
		return await this.uploadsService.uploadImage(
			user,
			file,
			user.id.toString(),
			'avatar',
			'user'
		)
	}

	@Post('images/blueprint/icon')
	@UseInterceptors(
		FileInterceptor('file', UploadsController.fileInterceptorOptions)
	)
	@Permission('users:blueprint.update.icon')
	async blueprintIconUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body('project_id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'icon',
			'blueprint'
		)
	}

	@Post('images/blueprint/banner')
	@UseInterceptors(
		FileInterceptor('file', UploadsController.fileInterceptorOptions)
	)
	@Permission('users:blueprint.update.banner')
	async blueprintBannerUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body('project_id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'banner',
			'blueprint'
		)
	}
	@Post('images/script/icon')
	@UseInterceptors(
		FileInterceptor('file', UploadsController.fileInterceptorOptions)
	)
	@Permission('users:script.update.icon')
	async scriptIconUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body('project_id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'icon',
			'script'
		)
	}

	@Post('images/script/banner')
	@UseInterceptors(
		FileInterceptor('file', UploadsController.fileInterceptorOptions)
	)
	@Permission('users:script.update.banner')
	async scriptBannerUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body('project_id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'banner',
			'script'
		)
	}
	@Post('images/theme/icon')
	@UseInterceptors(
		FileInterceptor('file', UploadsController.fileInterceptorOptions)
	)
	@Permission('users:theme.update.icon')
	async themaIconUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body('project_id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'icon',
			'theme'
		)
	}

	@Post('images/theme/banner')
	@UseInterceptors(
		FileInterceptor('file', UploadsController.fileInterceptorOptions)
	)
	@Permission('users:theme.update.banner')
	async themaBannerUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body('project_id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'banner',
			'theme'
		)
	}

	@Post('script')
	@UseInterceptors(FileInterceptor('file'))
	@Permission('users:script.update.file')
	async uploadScript(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File
	) {
		return await this.uploadsService.uploadScript(user, file)
	}

	@Post('blueprint')
	@UseInterceptors(FileInterceptor('file'))
	@Permission('users:blueprint.update.file')
	async uploadBlueprint(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File
	) {
		return await this.uploadsService.uploadBlueprint(user, file)
	}
}
