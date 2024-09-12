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

	paginate: PaginateFunction = paginator({ perPage: 10 })

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
		return await this.prisma.role.findUnique({ where: { id } })
	}

	async update(id: number, updateRoleInput: UpdateRoleInput) {
		return await this.prisma.role.update({
			data: updateRoleInput,
			where: { id }
		})
	}

	async remove(id: number) {
		return await this.prisma.role.delete({ where: { id } })
	}

	async hasPermission(
		userPermissions: string[],
		requiredPermission: string
	): Promise<boolean> {
		const permissionParts = requiredPermission.split('.')
		const permissionModificator = permissionParts[0].split(':')[0]
		permissionParts[0] = permissionParts[0].split(':')[1]
		for (const userPermission of userPermissions) {
			const userPermissionParts = userPermission.split('.')
			const result = this.matchPermissionParts(
				userPermissionParts,
				permissionParts,
				permissionModificator
			)
			if (result) {
				return true
			}
		}
		return false
	}

	private matchPermissionParts(
		userPermissionParts: string[],
		permissionParts: string[],
		permissionModificator: string
	): boolean {
		const userModificator = userPermissionParts[0].split(':')[0]
		userPermissionParts[0] = userPermissionParts[0].split(':')[1]

		if (userModificator === 'users' && permissionModificator === 'admin') {
			return false
		}

		for (let i = 0; i < permissionParts.length; i++) {
			if (userPermissionParts[i] === '*') {
				return true
			}
			if (userPermissionParts[i] !== permissionParts[i]) {
				return false
			}
		}
		return userPermissionParts.length === permissionParts.length
	}
}
