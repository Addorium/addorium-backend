import { Permission } from '@core/auth/decorators/roles.decorator'
import { CurrentUser } from '@core/auth/decorators/user.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { ProjectsService } from '@core/projects/projects.service'
import { hasPermission } from '@core/roles/permission.helper'
import { RolesService } from '@core/roles/roles.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import {
	Body,
	Controller,
	Delete,
	HttpException,
	Param,
	Post,
	Put,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateImageDto } from './dto/update-image.input'
import { UploadImageDto } from './dto/upload-image.input'
import { GalleryService } from './gallery.service'

@Controller('gallery')
export class GalleryController {
	constructor(
		private galleryService: GalleryService,
		private rolesService: RolesService,
		private projectService: ProjectsService
	) {}

	@Post()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.update.gallery')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.imagesInterceptorOptions)
	)
	async uploadImageToGallery(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body() uploadGalleryImageDto: UploadImageDto
	) {
		const hasAdminPermission = await hasPermission(
			user.role.permissions,
			'admin:project.update.gallery'
		)
		const isProjectOwner = await this.projectService.checkOwner(
			user,
			+uploadGalleryImageDto.projectId
		)

		if (hasAdminPermission && !isProjectOwner) {
			return await this.galleryService.uploadImageToGallery(
				file,
				uploadGalleryImageDto,
				user
			)
		} else if (!isProjectOwner) {
			throw new HttpException('Permission denied', 403)
		}

		return await this.galleryService.uploadImageToGallery(
			file,
			uploadGalleryImageDto,
			user
		)
	}
	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.update.gallery')
	async removeImageFromGallery(
		@Param('id') id: string,
		@CurrentUser() user: User
	) {
		const image = await this.galleryService.getById(+id)
		const hasAdminPermission = await hasPermission(
			user.role.permissions,
			'admin:project.update.gallery'
		)
		const isProjectOwner = await this.projectService.checkOwner(
			user,
			image.project.id
		)

		if (hasAdminPermission && !isProjectOwner) {
			return await this.galleryService.deleteImageFromGallery(+id)
		} else if (!isProjectOwner) {
			throw new HttpException('Permission denied', 403)
		}

		return await this.galleryService.deleteImageFromGallery(+id)
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.update.gallery')
	async updateImageInGallery(
		@Param('id') id: string,
		@CurrentUser() user: User,
		@Body() updateGalleryImageDto: UpdateImageDto
	) {
		const image = await this.galleryService.getById(+id)
		const hasAdminPermission = await hasPermission(
			user.role.permissions,
			'admin:project.update.gallery'
		)
		const isProjectOwner = await this.projectService.checkOwner(
			user,
			image.project.id
		)

		if (hasAdminPermission && !isProjectOwner) {
			return await this.galleryService.updateImageInGallery(
				+id,
				updateGalleryImageDto
			)
		} else if (!isProjectOwner) {
			throw new HttpException('Permission denied', 403)
		}

		return await this.galleryService.updateImageInGallery(
			+id,
			updateGalleryImageDto
		)
	}
}
