import { GstorageService } from '@core/gstorage/gstorage.service'
import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { HttpException, Injectable } from '@nestjs/common'
import { ProjectType } from '@prisma/client'
import { CategoryFilterInput } from './dto/category-filter.input'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoriesService {
	constructor(
		private prismaService: PrismaService,
		private gstorage: GstorageService
	) {}
	paginate: PaginateFunction = paginator({ perPage: 20 })
	async create(
		createCategoryDto: CreateCategoryDto,
		file: Express.Multer.File
	): Promise<Category> {
		const hasName = await this.prismaService.category.count({
			where: { name: createCategoryDto.name }
		})
		if (hasName > 0) {
			throw new HttpException('Category name already exists', 400)
		}
		const { filename } = await this.uploadCategoryIcon(file)
		const category = this.prismaService.category.create({
			data: { ...createCategoryDto, icon: filename }
		})
		return category
	}

	async findAll(
		categoryFilterProps: CategoryFilterInput
	): Promise<PaginatedResult<Category>> {
		const { page, ...rest } = categoryFilterProps
		const { orderBy, orderDirection, ...sfilter } = rest
		const { search, ...filter } = sfilter

		if (orderDirection && !orderBy) {
			throw new HttpException(
				'orderBy must be provided when orderDirection is provided',
				400
			)
		}

		const response = await this.paginate<Category, any>(
			this.prismaService.category,
			{
				where: {
					...filter,
					...(search
						? {
								OR: [{ name: { contains: search, mode: 'insensitive' } }]
							}
						: {})
				},
				orderBy: { [orderBy]: orderDirection }
			},
			{
				page,
				perPage: 200
			}
		)

		return response
	}

	async findOne(id: number, projectType: ProjectType): Promise<Category> {
		return this.prismaService.category.findFirst({
			where: { id: +id, projectType }
		})
	}

	async update(
		id: number,
		updateCategoryDto: UpdateCategoryDto,
		file: Express.Multer.File
	): Promise<Category> {
		const currentCategory = await this.prismaService.category.findFirst({
			where: { id }
		})
		if (file.size !== 0 && currentCategory.icon) {
			await this.deleteCategoryIcon(currentCategory.icon)
		}
		if (file.size !== 0) {
			const { filename } = await this.uploadCategoryIcon(file)
			updateCategoryDto.icon = filename
		}
		const category = await this.prismaService.category.update({
			where: { id },
			data: { ...updateCategoryDto }
		})
		return category
	}

	async remove(id: number): Promise<Category> {
		const currentCategory = await this.prismaService.category.findFirst({
			where: { id: +id }
		})
		if (currentCategory.icon) {
			await this.deleteCategoryIcon(currentCategory.icon)
		}
		return this.prismaService.category.delete({ where: { id: +id } })
	}

	async uploadCategoryIcon(
		file: Express.Multer.File
	): Promise<{ filename: string; url: string }> {
		const { filename, url } = UploadsService.getFullFileName('category', 'icon')
		const uploadet_file = await this.gstorage.uploadFile(url, file.buffer)
		return {
			filename: filename,
			url: uploadet_file
		}
	}
	async deleteCategoryIcon(name: string): Promise<void> {
		const { url } = UploadsService.getFullFileName(
			'category',
			'icon',
			'svg',
			name
		)
		try {
			await this.gstorage.deleteFile(url)
		} catch (error) {}
	}
}
