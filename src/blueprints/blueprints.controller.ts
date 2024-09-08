import { Permission } from '@core/auth/decorators/roles.decorator'
import { CurrentUser } from '@core/auth/decorators/user.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { BlueprintsService } from './blueprints.service'
import { BlueprintsFilterInput } from './dto/blueprints-filter.input'
import { CreateBlueprintInput } from './dto/create-blueprint.input'
import { UpdateBlueprintInput } from './dto/update-blueprint.input'

@Controller('blueprints')
@ApiTags('blueprints')
export class BlueprintsController {
	constructor(
		private readonly blueprintsService: BlueprintsService,
		private uploadsService: UploadsService
	) {}

	@Post()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprint.create')
	@ApiBearerAuth()
	async createBlueprint(
		@CurrentUser() user: User,
		@Body() createBlueprintInput: CreateBlueprintInput
	) {
		return await this.blueprintsService.create(user, createBlueprintInput)
	}

	@Get()
	async findAll(@Query() blueprintsFilter: BlueprintsFilterInput) {
		return await this.blueprintsService.findAll(blueprintsFilter)
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		return await this.blueprintsService.findOne(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprints.update')
	@ApiBearerAuth()
	async updateBlueprint(
		@CurrentUser() user: User,
		@Param('id') id: number,
		@Body() updateBlueprintInput: UpdateBlueprintInput
	) {
		return await this.blueprintsService.update(user, updateBlueprintInput)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprints.delete')
	@ApiBearerAuth()
	async removeBlueprint(@CurrentUser() user: User, @Param('id') id: number) {
		return await this.blueprintsService.remove(user, id)
	}

	@Patch('upload/icon/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprints.update.icon')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.imagesInterceptorOptions)
	)
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
				}
			}
		}
	})
	async blueprintIconUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Query('id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'icon',
			'blueprint'
		)
	}
	@Patch('upload/banner/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprints.update.banner')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.imagesInterceptorOptions)
	)
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
				}
			}
		}
	})
	async blueprintBannerUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Query('id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'banner',
			'blueprint'
		)
	}
	@Patch('upload/file/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprints.update.file')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.blueprintsInterceptorOptions)
	)
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
				}
			}
		}
	})
	async blueprintFileUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Query('id') project_id: string
	) {
		return await this.uploadsService.uploadImage(
			user,
			file,
			project_id,
			'file',
			'blueprint'
		)
	}
}
