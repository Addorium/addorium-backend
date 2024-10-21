import { Permission } from '@core/auth/decorators/roles.decorator'
import { CurrentUser } from '@core/auth/decorators/user.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { RolesService } from '@core/roles/roles.service'
import { TagsService } from '@core/tags/tags.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { ProjectType } from '@prisma/client'
import { CreateProjectInput } from './dto/create-projects.input'
import {
	ProjectsFilterAllInput,
	ProjectsFilterInput
} from './dto/projects-filter.input'
import { UpdateProjectFileDto } from './dto/update-file.input'
import { UpdateProjectInput } from './dto/update-projects.input'
import { Project } from './entities/projects.entity'
import { ProjectsService } from './projects.service'

@Controller('projects')
@ApiTags('projects')
export class ProjectsController {
	constructor(
		private readonly projectsService: ProjectsService,
		private readonly rolesService: RolesService,
		private readonly tagsService: TagsService
	) {}

	@Post()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.create')
	@ApiBearerAuth()
	async createBlueprint(
		@CurrentUser() user: User,
		@Body() createBlueprintInput: CreateProjectInput
	) {
		return await this.projectsService.create(user, createBlueprintInput)
	}

	@Get()
	async findAll(@Query() blueprintsFilter: ProjectsFilterInput) {
		return await this.projectsService.findAll(blueprintsFilter)
	}
	@Get('all')
	async getAllSimple(@Query() blueprintsAllFilter: ProjectsFilterAllInput) {
		return await this.projectsService.simpleFindAll({
			...blueprintsAllFilter
		})
	}

	@Get('user/my')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.read.own')
	async findAllUserProjects(
		@CurrentUser() user: User,
		@Query() blueprintsFilter: ProjectsFilterInput
	) {
		return await this.projectsService.findAllByUser(
			user.id.toString(),
			blueprintsFilter
		)
	}

	@Get('user/:userId')
	async findAllByUser(
		@Param('userId') userId: string,
		@Query() blueprintsFilter: ProjectsFilterInput
	) {
		return await this.projectsService.findAllByUser(userId, blueprintsFilter)
	}

	@Get('slug/:slug')
	async findOneBySlug(@Param('slug') slug: string) {
		return await this.projectsService.findOneBySlug(slug)
	}
	@Get('tags/:type')
	async findAllTags(@Param('type') type: ProjectType) {
		return await this.tagsService.findAll({ projectType: type, perPage: 100 })
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<Project> {
		return await this.projectsService.findOneById(+id)
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.update')
	@ApiBearerAuth()
	async updateProject(
		@CurrentUser() user: User,
		@Body() updateBlueprintInput: UpdateProjectInput
	) {
		await this.projectsService.checkUpdatePermissions(
			user,
			updateBlueprintInput.id
		)

		return await this.projectsService.update(updateBlueprintInput)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.delete')
	@ApiBearerAuth()
	async removeProject(@CurrentUser() user: User, @Param('id') id: number) {
		await this.projectsService.checkUpdatePermissions(user, +id)
		return await this.projectsService.remove(user, +id)
	}

	@Patch('update/icon')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.update.icon')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.imagesInterceptorOptions)
	)
	async projectIconUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Body() updateUaerAvatarDto: UpdateProjectFileDto
	) {
		if (file === undefined) {
			throw new HttpException('File not found! Please try again.', 400)
		}
		await this.projectsService.checkUpdatePermissions(
			user,
			updateUaerAvatarDto.id
		)
		const project = await this.projectsService.findOneById(
			+updateUaerAvatarDto.id
		)
		return await this.projectsService.uploadProjectImage(
			file,
			project,
			user.id,
			'icon'
		)
	}
	@Delete('update/icon/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.update.icon')
	@ApiBearerAuth()
	async projectIconClear(@CurrentUser() user: User, @Param('id') id: number) {
		const project = await this.projectsService.findOneById(+id)
		await this.projectsService.checkUpdatePermissions(user, +id)
		return await this.projectsService.clearIcon(project, 'icon')
	}

	@Patch('update/file/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:project.update.file')
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
	async projectFileUpload(
		@CurrentUser() user: User,
		@UploadedFile() file: Express.Multer.File,
		@Query('id') project_id: string
	) {
		const project = await this.projectsService.findOneById(+project_id)
		await this.projectsService.checkUpdatePermissions(user, +project_id)
		return await this.projectsService.uploadProjectImage(
			file,
			project,
			user.id,
			'file'
		)
	}
}
