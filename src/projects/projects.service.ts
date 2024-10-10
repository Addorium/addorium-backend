import { GstorageService } from '@core/gstorage/gstorage.service'
import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { Type } from '@core/uploads/dto/upload-image.dto'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import { Injectable } from '@nestjs/common'
import { ProjectType } from '@prisma/client'
import { CreateProjectInput } from './dto/create-projects.input'
import { ProjectsFilterInput } from './dto/projects-filter.input'
import { UpdateProjectInput } from './dto/update-projects.input'
import { Project } from './entities/projects.entity'

@Injectable()
export class ProjectsService {
	constructor(
		private prisma: PrismaService,
		private gstorage: GstorageService
	) {}

	paginate: PaginateFunction = paginator({ perPage: 20 })

	async create(user: User, createBlueprintInput: CreateProjectInput) {
		const blueprint = await this.prisma.project.create({
			data: { ...createBlueprintInput, ownerId: user.id },
			include: {
				owner: {
					select: {
						id: true,
						name: true,
						avatar: true,
						discordId: true,
						role: {
							select: {
								id: true,
								name: true,
								permissions: true
							}
						}
					}
				}
			}
		})
		return blueprint
	}

	async findAll(
		blueprintsFilter: ProjectsFilterInput
	): Promise<PaginatedResult<Project>> {
		const { page, ...rest } = blueprintsFilter
		const { orderBy, orderDirection, ...sfilter } = rest
		const { search, ...filter } = sfilter

		const response = await this.paginate<Project, any>(
			this.prisma.project,
			{
				where: {
					...filter,
					...(search
						? {
								OR: [
									{ name: { contains: search, mode: 'insensitive' } },
									{ description: { contains: search, mode: 'insensitive' } }
								]
							}
						: {})
				},
				orderBy: { [orderBy]: orderDirection },
				include: {
					owner: {
						select: {
							id: true,
							name: true,
							avatar: true,
							discordId: true,
							role: {
								select: {
									id: true,
									name: true,
									permissions: true
								}
							}
						}
					}
				}
			},
			{
				page
			}
		)

		return response
	}

	async findAllByUser(
		userId: string,
		blueprintsFilter: ProjectsFilterInput
	): Promise<PaginatedResult<Project>> {
		const { page, ...rest } = blueprintsFilter
		const { orderBy, orderDirection, ...sfilter } = rest
		const { search, ...filter } = sfilter

		const response = await this.paginate<Project, any>(
			this.prisma.project,
			{
				where: {
					ownerId: +userId,
					...filter,
					...(search
						? {
								OR: [
									{ name: { contains: search, mode: 'insensitive' } },
									{ description: { contains: search, mode: 'insensitive' } }
								]
							}
						: {})
				},
				orderBy: { [orderBy]: orderDirection },
				include: {
					owner: {
						select: {
							id: true,
							name: true,
							avatar: true,
							discordId: true,
							role: {
								select: {
									id: true,
									name: true,
									permissions: true
								}
							}
						}
					}
				}
			},
			{
				page
			}
		)

		return response
	}

	async findOneBySlug(slug: string) {
		const blueprint = await this.prisma.project.findUnique({
			where: { slug: slug },
			include: {
				owner: {
					select: {
						id: true,
						name: true,
						avatar: true,
						discordId: true,
						role: {
							select: {
								id: true,
								name: true,
								permissions: true
							}
						}
					}
				},
				category: true,
				tags: true
			}
		})
		return blueprint
	}

	async findAllTags(type: ProjectType) {
		switch (type) {
		}
	}

	async findOne(id: number): Promise<Project> {
		const blueprint = await this.prisma.project.findUnique({
			where: { id },
			include: {
				tags: true,
				category: true,
				banner: true,
				owner: {
					select: {
						id: true,
						name: true,
						avatar: true,
						email: true,
						discordId: true,
						role: {
							select: {
								id: true,
								name: true,
								permissions: true
							}
						}
					}
				}
			}
		})
		return blueprint
	}

	async update(user: User, updateBlueprintInput: UpdateProjectInput) {
		const { id, tags, ...data } = updateBlueprintInput

		// Шаг 1: Получаем текущий проект с тегами
		const currentProject = await this.prisma.project.findUnique({
			where: { id },
			select: {
				tags: {
					select: {
						id: true
					}
				}
			}
		})

		// Шаг 2: Подготовка списка текущих тегов для отключения
		const currentTags = currentProject?.tags.map(tag => ({ id: tag.id })) || []

		// Шаг 3: Подготовка объекта данных для обновления
		const updateData: any = { ...data }

		// Шаг 4: Обновляем теги только если они не null
		if (tags !== null && tags !== undefined) {
			updateData.tags = {
				disconnect: currentTags, // Отключаем старые теги
				connect: tags.map(tagId => ({ id: tagId })) // Подключаем новые теги по ID
			}
		}

		// Шаг 5: Обновляем проект
		const blueprint = await this.prisma.project.update({
			where: { id },
			data: updateData,
			include: {
				tags: true,
				category: true,
				owner: {
					select: {
						id: true,
						name: true,
						avatar: true,
						discordId: true,
						role: {
							select: {
								id: true,
								name: true,
								permissions: true
							}
						}
					}
				}
			}
		})

		return blueprint
	}

	async updateImage(id: number, type: Type, image: string) {
		const blueprint = await this.prisma.project.update({
			where: { id },
			data: { [type]: image },
			select: {
				id: true,
				name: true,
				description: true,
				owner: {
					select: {
						id: true,
						name: true,
						avatar: true,
						discordId: true,
						role: {
							select: {
								id: true,
								name: true,
								permissions: true
							}
						}
					}
				},
				icon: true,
				banner: true
			}
		})
		return blueprint
	}

	async clearIcon(project: Project, type: Type) {
		this.updateImage(project.id, type, 'default.webp')
		return { success: true }
	}

	async checkOwner(user: User, id: number): Promise<boolean> {
		const blueprint = await this.prisma.project.findUnique({ where: { id } })
		if (blueprint.ownerId !== user.id) {
			return false
		}
		return true
	}

	async remove(user: User, id: number) {
		await this.checkOwner(user, id)
		const blueprint = await this.prisma.project.delete({
			where: { id },
			include: {
				owner: {
					select: {
						id: true,
						name: true,
						avatar: true,
						discordId: true,
						role: {
							select: {
								id: true,
								name: true,
								permissions: true
							}
						}
					}
				}
			}
		})
		return blueprint
	}
	async uploadProjectImage(
		file: Express.Multer.File,
		project: Project,
		ownerId: number,
		type: Type
	) {
		const prevIcon = project.icon
		if (prevIcon !== 'default.webp') {
			const { url: prevUrl } = UploadsService.getFullFileName(
				'project',
				type,
				prevIcon
			)
			try {
				await this.gstorage.deleteFile(prevUrl)
			} catch (error) {}
		}
		const webpBuffer = await UploadsService.convertToWebP(file.buffer)
		const { filename, url } = UploadsService.getFullFileName('project', type)
		const uploadet_file = await this.gstorage.uploadFile(url, webpBuffer)
		const blueprint = await this.prisma.project.update({
			where: { id: +project.id, ownerId: ownerId },
			data: { [type]: filename }
		})
		return {
			filename: filename,
			url: uploadet_file,
			blueprint: blueprint
		}
	}
}
