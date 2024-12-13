import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateRoleInput } from './dto/create-role.input'
import { RoleFilterInput } from './dto/role-filter.input'
import { UpdateRoleInput } from './dto/update-role.input'
import { Role } from './entities/role.entity'

@Injectable()
export class RolesService {
	constructor(private prisma: PrismaService) {}

	paginate: PaginateFunction = paginator({ perPage: 20 })

	async create(createRoleInput: CreateRoleInput) {
		return await this.prisma.role.create({ data: createRoleInput })
	}

	async findAll(roleFilters: RoleFilterInput): Promise<PaginatedResult<Role>> {
		const { page, ...rest } = roleFilters
		const { orderDirection, ...sfilter } = rest
		const { search, ...filter } = sfilter

		return this.paginate(
			this.prisma.role,
			{
				where: {
					...filter,
					...(search
						? {
								OR: [{ name: { contains: search, mode: 'insensitive' } }]
							}
						: {})
				},
				orderBy: { ['name']: orderDirection }
			},
			{
				page
			}
		)
	}

	async findOne(id: number) {
		return await this.prisma.role.findUnique({ where: { id: +id } })
	}

	async update(id: number, updateRoleInput: UpdateRoleInput) {
		return await this.prisma.role.update({
			data: updateRoleInput,
			where: { id: +id }
		})
	}

	async remove(id: number) {
		return await this.prisma.role.delete({ where: { id: +id } })
	}
}
