import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { Type } from '@core/uploads/dto/upload-image.dto'
import { User } from '@core/user/entity/user.entity'
import { Injectable } from '@nestjs/common'
import { BlueprintsFilterInput } from './dto/blueprints-filter.input'
import { CreateBlueprintInput } from './dto/create-blueprint.input'
import { UpdateBlueprintInput } from './dto/update-blueprint.input'
import { Blueprint } from './entities/blueprint.entity'

@Injectable()
export class BlueprintsService {
	constructor(private prisma: PrismaService) {}

	paginate: PaginateFunction = paginator({ perPage: 20 })

	async create(user: User, createBlueprintInput: CreateBlueprintInput) {
		const blueprint = await this.prisma.blueprints.create({
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
		blueprintsFilter: BlueprintsFilterInput
	): Promise<PaginatedResult<Blueprint>> {
		const { page, ...rest } = blueprintsFilter
		const { orderBy, orderDirection, ...sfilter } = rest
		const { search, ...filter } = sfilter

		const response = await this.paginate<Blueprint, any>(
			this.prisma.blueprints,
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

	async findOne(id: number) {
		const blueprint = await this.prisma.blueprints.findUnique({
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

	async update(user: User, updateBlueprintInput: UpdateBlueprintInput) {
		const { id: id, ...data } = updateBlueprintInput
		await this.checkOwner(user, id)
		const blueprint = await this.prisma.blueprints.update({
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

	async updateImage(user: User, id: number, type: Type, image: string) {
		await this.checkOwner(user, id)
		const blueprint = await this.prisma.blueprints.update({
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

	async checkOwner(user: User, id: number): Promise<boolean> {
		const blueprint = await this.prisma.blueprints.findUnique({ where: { id } })
		if (blueprint.ownerId !== user.id) {
			throw new Error('You are not the owner of this blueprint')
		}
		return true
	}

	async remove(user: User, id: number) {
		await this.checkOwner(user, id)
		const blueprint = await this.prisma.blueprints.delete({
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
}
