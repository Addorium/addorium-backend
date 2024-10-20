import { GstorageService } from '@core/gstorage/gstorage.service'
import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { HttpException, Injectable } from '@nestjs/common'
import { ProjectType } from '@prisma/client'
import { CreateTagDto } from './dto/create-tag.dto'
import { TagsFilterInput } from './dto/tags-filter.input'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Tag } from './entities/tag.entity'

@Injectable()
export class TagsService {
	constructor(
		private prismaService: PrismaService,
		private gstorage: GstorageService
	) {}

	paginate: PaginateFunction = paginator({ perPage: 20 })

	async create(
		createTagDto: CreateTagDto,
		file: Express.Multer.File
	): Promise<Tag> {
		const hasName = await this.prismaService.tag.count({
			where: { name: createTagDto.name }
		})
		if (hasName > 0) {
			throw new HttpException('Tag with this name already exists', 400)
		}
		const { filename } = await this.uploadTagIcon(file)
		const tag = this.prismaService.tag.create({
			data: { ...createTagDto, icon: filename }
		})
		return tag
	}

	async findAll(tagsFilter: TagsFilterInput): Promise<PaginatedResult<Tag>> {
		const { page, perPage = 200, ...rest } = tagsFilter
		const { orderBy, orderDirection, ...sfilter } = rest
		const { search, ...filter } = sfilter

		const response = await this.paginate<Tag, any>(
			this.prismaService.tag,
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
				perPage: perPage
			}
		)

		return response
	}

	async findOne(id: number, projectType: ProjectType): Promise<Tag> {
		return this.prismaService.tag.findFirst({
			where: { id, projectType }
		})
	}

	async update(
		id: number,
		updateTagDto: UpdateTagDto,
		file: Express.Multer.File
	): Promise<Tag> {
		const currentTag = await this.prismaService.tag.findFirst({ where: { id } })
		if (file.size !== 0 && currentTag.icon) {
			await this.deleteTagIcon(currentTag.icon)
		}
		if (file.size !== 0) {
			const { filename } = await this.uploadTagIcon(file)
			updateTagDto.icon = filename
		}
		const tag = await this.prismaService.tag.update({
			where: { id },
			data: { ...updateTagDto }
		})
		return tag
	}

	async remove(id: number): Promise<Tag> {
		return this.prismaService.tag.delete({ where: { id } })
	}

	async uploadTagIcon(
		file: Express.Multer.File
	): Promise<{ filename: string; url: string }> {
		const { filename, url } = UploadsService.getFullFileName('tag', 'icon')
		const uploadet_file = await this.gstorage.uploadFile(url, file.buffer)
		return {
			filename: filename,
			url: uploadet_file
		}
	}
	async deleteTagIcon(name: string): Promise<void> {
		const { url } = UploadsService.getFullFileName('tag', 'icon', 'webp', name)
		try {
			await this.gstorage.deleteFile(url)
		} catch (error) {
			console.error(error)
		}
	}
}
