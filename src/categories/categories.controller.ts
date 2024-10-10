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
import { CategoriesService } from './categories.service'
import { CategoryFilterInput } from './dto/category-filter.input'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:tag.create')
	@UseInterceptors(
		FileInterceptor('file', UploadsService.svgInterceptorOptions)
	)
	async create(
		@UploadedFile() file: Express.Multer.File,
		@Body() createTagDto: CreateCategoryDto
	) {
		return await this.categoriesService.create(createTagDto, file)
	}

	@Get()
	async findAll(@Query() categoriesFilter: CategoryFilterInput) {
		return await this.categoriesService.findAll(categoriesFilter)
	}

	@Get(':id')
	async findOne(
		@Param('id') id: string,
		@Query('projectType') projectType: ProjectType
	) {
		return await this.categoriesService.findOne(+id, projectType)
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
		@Body() updateTagDto: UpdateCategoryDto
	) {
		return await this.categoriesService.update(+id, updateTagDto, file)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:tag.delete')
	async remove(@Param('id') id: string) {
		return await this.categoriesService.remove(+id)
	}
}
