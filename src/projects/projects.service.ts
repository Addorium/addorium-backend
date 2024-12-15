import { GstorageService } from '@core/gstorage/gstorage.service'
import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { hasPermission } from '@core/roles/permission.helper'
import { RolesService } from '@core/roles/roles.service'
import { Type } from '@core/uploads/dto/upload-image.dto'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import { HttpException, Injectable } from '@nestjs/common'
import { Prisma, ProjectStatus } from '@prisma/client'
import { CreateProjectInput } from './dto/create-projects.input'
import {
	ProjectsFilterAllInput,
	ProjectsFilterInput
} from './dto/projects-filter.input'
import { UpdateProjectInput } from './dto/update-projects.input'
import { Project } from './entities/projects.entity'

@Injectable()
export class ProjectsService {
	constructor(
		private prisma: PrismaService,
		private gstorage: GstorageService,
		private rolesService: RolesService
	) {}

	paginate: PaginateFunction = paginator({ perPage: 20 })

	private async checkDuplicateProjectNameOrSlug(
		name: string,
		slug: string,
		projectId?: number
	): Promise<void> {
		const hasName = await this.prisma.project.count({
			where: { name, id: { not: projectId } }
		})
		const hasSlug = await this.prisma.project.count({
			where: { slug, id: { not: projectId } }
		})

		if (hasName > 0) {
			throw new HttpException('Project name already exists', 400)
		}
		if (hasSlug > 0) {
			throw new HttpException('Project slug already exists', 400)
		}
	}

	private buildProjectInclude() {
		return {
			owner: {
				select: {
					id: true,
					name: true,
					avatar: true,
					discordId: true,
					email: true,
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
			tags: true,
			galleryImages: {
				select: {
					id: true,
					description: true,
					title: true,
					url: true,
					projectId: true,
					createdAt: true,
					updatedAt: true,
					deletedAt: true
				}
			},
			banner: {
				select: {
					id: true,
					description: true,
					title: true,
					url: true,
					projectId: true,
					createdAt: true,
					updatedAt: true,
					deletedAt: true
				}
			}
		}
	}

	async create(
		user: User,
		createProjectInput: CreateProjectInput
	): Promise<Project> {
		await this.checkDuplicateProjectNameOrSlug(
			createProjectInput.name,
			createProjectInput.slug
		)

		const project = await this.prisma.project.create({
			data: { ...createProjectInput, ownerId: user.id },
			include: this.buildProjectInclude()
		})
		return project
	}

	async findAll(
		blueprintsFilter: ProjectsFilterInput
	): Promise<PaginatedResult<Project>> {
		const {
			page,
			search,
			orderBy,
			orderDirection,
			categories,
			tags,
			projectStatus,
			perPage
		} = blueprintsFilter

		const response = await this.paginate<Project, Prisma.ProjectFindManyArgs>(
			this.prisma.project,
			{
				where: {
					...(search && {
						OR: [
							{ name: { contains: search, mode: 'insensitive' } },
							{ description: { contains: search, mode: 'insensitive' } }
						]
					}),
					...(projectStatus ? { status: projectStatus as ProjectStatus } : {}),
					...(tags && tags.length > 0
						? { tags: { some: { name: { in: tags } } } }
						: {}),
					...(categories && categories.length > 0
						? { category: { name: { in: categories } } }
						: {})
				},
				orderBy:
					orderBy === 'category'
						? { category: { name: orderDirection } }
						: { [orderBy]: orderDirection },
				include: this.buildProjectInclude()
			},
			{ page: page, perPage: perPage || 20 }
		)

		return response
	}
	async simpleFindAll(
		blueprintsFilter: ProjectsFilterAllInput
	): Promise<PaginatedResult<Project>> {
		const { page, search, projectType, categories, tags, perPage } =
			blueprintsFilter

		const response = await this.paginate<Project, Prisma.ProjectFindManyArgs>(
			this.prisma.project,
			{
				where: {
					...(search && {
						OR: [
							{ name: { contains: search, mode: 'insensitive' } },
							{ description: { contains: search, mode: 'insensitive' } }
						]
					}),
					type: projectType,
					status: 'PUBLISHED',
					...(tags && tags.length > 0
						? { tags: { some: { name: { in: tags } } } }
						: {}),
					...(categories && categories.length > 0
						? { category: { name: { in: categories } } }
						: {})
				},
				include: this.buildProjectInclude()
			},
			{ page: page, perPage: perPage || 20 }
		)

		return response
	}

	async findAllByUser(
		userId: string,
		blueprintsFilter: ProjectsFilterInput
	): Promise<PaginatedResult<Project>> {
		const {
			page,
			search,
			orderBy,
			orderDirection,
			tags,
			categories,
			projectStatus
		} = blueprintsFilter

		const response = await this.paginate<Project, Prisma.ProjectFindManyArgs>(
			this.prisma.project,
			{
				where: {
					ownerId: +userId,
					...(search && {
						OR: [
							{ name: { contains: search, mode: 'insensitive' } },
							{ description: { contains: search, mode: 'insensitive' } }
						]
					}),
					...(projectStatus ? { status: projectStatus as ProjectStatus } : {}),
					...(tags && tags.length > 0
						? { tags: { some: { name: { in: tags } } } }
						: {}),
					...(categories && categories.length > 0
						? { category: { name: { in: categories } } }
						: {})
				},
				orderBy: { [orderBy]: orderDirection },
				include: this.buildProjectInclude()
			},
			{ page }
		)

		return response
	}

	async findOneBySlug(slug: string): Promise<Project> {
		const project = await this.prisma.project.findUnique({
			where: { slug },
			include: this.buildProjectInclude()
		})
		return project
	}
	async findOneById(id: number): Promise<Project> {
		const project = await this.prisma.project.findUnique({
			where: { id: +id },
			include: this.buildProjectInclude()
		})
		return project
	}

	async update(updateProjectInput: UpdateProjectInput): Promise<Project> {
		const { id, tags, ...data } = updateProjectInput
		if (data.name || data.slug) {
			await this.checkDuplicateProjectNameOrSlug(data.name, data.slug, id)
		}

		const currentProject = await this.findOneById(+id)

		if (data.status === 'PUBLISHED' && currentProject.status === 'DRAFT') {
			data.status = 'MODERATION'
		}

		const currentTags = await this.prisma.project
			.findUnique({
				where: { id },
				select: { tags: { select: { id: true } } }
			})
			.then(project => project?.tags.map(tag => ({ id: tag.id })) || [])

		const updatedProject = await this.prisma.project.update({
			where: { id },
			data: {
				...data,
				tags: {
					disconnect: currentTags,
					connect: tags?.map(tagId => ({ id: tagId })) || []
				}
			},
			include: this.buildProjectInclude()
		})
		return updatedProject
	}

	async updateImage(id: number, type: Type, image: string): Promise<Project> {
		const project = await this.prisma.project.update({
			where: { id: +id },
			data: { [type]: image },
			include: this.buildProjectInclude()
		})
		return project
	}

	async remove(user: User, id: number): Promise<Project> {
		await this.checkOwner(user, +id)
		const project = await this.prisma.project.delete({
			where: { id: +id },
			include: this.buildProjectInclude()
		})
		return project
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
		const uploadedFile = await this.gstorage.uploadFile(url, webpBuffer)
		const updatedProject = await this.prisma.project.update({
			where: { id: +project.id, ownerId: +ownerId },
			data: { [type]: filename }
		})
		return { filename, url: uploadedFile, project: updatedProject }
	}

	async clearIcon(project: Project, type: Type) {
		this.updateImage(project.id, type, 'default.webp')
		return { success: true }
	}

	async checkOwner(user: User, id: number): Promise<boolean> {
		const project = await this.prisma.project.findUnique({ where: { id: +id } })
		if (!project || +project.ownerId !== +user.id) {
			return false
		}
		return true
	}
	async checkUpdatePermissions(user: User, projectId: number) {
		const project = await this.findOneById(+projectId)
		const isOwner = await this.checkOwner(user, +projectId)
		const hasAdminPermission = await hasPermission(
			user.role.permissions,
			'admin:projects.update'
		)
		if (project.status === 'MODERATION' && !hasAdminPermission) {
			throw new HttpException(
				'Only admins can update a project in moderation status',
				403
			)
		}
		if (!isOwner && !hasAdminPermission) {
			throw new HttpException(
				'You do not have permission to update this project',
				403
			)
		}
	}
	async checkUpdatePermissionsiInternal(user: User, projectId: number) {
		const project = await this.findOneById(+projectId)
		const isOwner = await this.checkOwner(user, +projectId)
		const hasAdminPermission = await hasPermission(
			user.role.permissions,
			'admin:projects.update'
		)
		if (project.status === 'MODERATION' && !hasAdminPermission) {
			return false
		}
		if (!isOwner && !hasAdminPermission) {
			return false
		}
		return true
	}
}
