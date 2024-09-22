import { GstorageService } from '@core/gstorage/gstorage.service'
import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { Type } from '@core/uploads/dto/upload-image.dto'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import { Injectable } from '@nestjs/common'
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
		const blueprint = await this.prisma.projects.create({
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
			this.prisma.projects,
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
			this.prisma.projects,
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
		const blueprint = await this.prisma.projects.findUnique({
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
				}
			}
		})
		return blueprint
	}

	async findOne(id: number): Promise<Project> {
		const blueprint = await this.prisma.projects.findUnique({
			where: { id },
			include: {
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
		const { id: id, ...data } = updateBlueprintInput
		await this.checkOwner(user, id)
		const blueprint = await this.prisma.projects.update({
			where: { id },
			data: { ...data },
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

	async updateImage(id: number, type: Type, image: string) {
		const blueprint = await this.prisma.projects.update({
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
		const blueprint = await this.prisma.projects.findUnique({ where: { id } })
		if (blueprint.ownerId !== user.id) {
			return false
		}
		return true
	}

	async remove(user: User, id: number) {
		await this.checkOwner(user, id)
		const blueprint = await this.prisma.projects.delete({
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
		const prevIcon = type === 'icon' ? project.icon : project.banner
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
		const blueprint = await this.prisma.projects.update({
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
