import { Permission } from '@core/auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { UploadsService } from '@core/uploads/uploads.service'
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
import { ProjectType } from '@prisma/client'
import { CreateTagDto } from './dto/create-tag.dto'
import { TagsFilterInput } from './dto/tags-filter.input'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagsService } from './tags.service'

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Post()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:tag.create')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.svgInterceptorOptions)
	)
	async create(
		@UploadedFile() file: Express.Multer.File,
		@Body() createTagDto: CreateTagDto
	) {
		return await this.tagsService.create(createTagDto, file)
	}

	@Get()
	async findAll(@Query() tagsFilter: TagsFilterInput) {
		return await this.tagsService.findAll(tagsFilter)
	}

	@Get(':id')
	async findOne(
		@Param('id') id: string,
		@Query('projectType') projectType: ProjectType
	) {
		return await this.tagsService.findOne(+id, projectType)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:tag.update')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.svgInterceptorOptions)
	)
	async update(
		@UploadedFile() file: Express.Multer.File,
		@Param('id') id: string,
		@Body() updateTagDto: UpdateTagDto
	) {
		return await this.tagsService.update(+id, updateTagDto, file)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:tag.delete')
	async remove(@Param('id') id: string) {
		return await this.tagsService.remove(+id)
	}
}
