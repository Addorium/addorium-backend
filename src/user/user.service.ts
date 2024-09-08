import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma } from '@prisma/client'
import { UpdateUserInput } from './dto/update-user.input'
import { UserFilterInput } from './dto/user-filter.input'
import { ClearUser } from './entity/clean_user.entity'
import { User } from './entity/user.entity'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}
	paginate: PaginateFunction = paginator({ perPage: 20 })

	async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
		const user = this.prisma.user.create({
			data: createUserDto,
			include: { role: true }
		})
		return user
	}

	async getAll(
		userFilters: UserFilterInput
	): Promise<PaginatedResult<ClearUser>> {
		const { page, ...rest } = userFilters
		const { orderBy, orderDirection, ...sfilter } = rest
		const { search, roleId, ...filter } = sfilter

		const response = await this.paginate<ClearUser, any>(
			this.prisma.user,
			{
				where: {
					roleId: +roleId,
					...filter,
					...(search
						? {
								OR: [{ name: { contains: search, mode: 'insensitive' } }]
							}
						: {})
				},
				orderBy: { [orderBy]: orderDirection },
				include: {
					role: true
				}
			},
			{
				page
			}
		)
		return response
	}
	async getById(id: number): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id: id },
			include: { role: true }
		})
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return user
	}
	async getByDiscordId(id: string): Promise<User> {
		const user = await this.prisma.user.findFirst({
			where: { discordId: id },
			include: { role: true }
		})
		if (!user) {
			return null
		}
		return user
	}
	async storeRefreshToken(refreshToken: string, userId: number) {
		const user = await this.getById(userId)
		if (!user) {
			throw new NotFoundException('[r] User not found')
		}
		return await this.prisma.user.update({
			where: { id: userId },
			data: { refreshToken: refreshToken }
		})
	}
	async update(updateUserDto: UpdateUserInput): Promise<User> {
		const user = await this.getById(updateUserDto.id)
		if (!user) {
			throw new NotFoundException('[u] User not found')
		}
		return this.prisma.user.update({
			where: { id: updateUserDto.id },
			data: updateUserDto,
			include: { role: true }
		})
	}

	async updateUaerAvatar(id: number, avatar: string): Promise<User> {
		const user = await this.getById(id)
		if (!user) {
			throw new NotFoundException('[ua] User not found')
		}
		return this.prisma.user.update({
			where: { id: id },
			data: { avatar: avatar },
			include: { role: true }
		})
	}

	async remove(id: number): Promise<User> {
		const user = await this.getById(id)
		if (!user) {
			throw new NotFoundException('[r] User not found')
		}
		return this.prisma.user.delete({
			where: { id: id },
			include: { role: true }
		})
	}

	async exclude(
		user: Promise<User> | User | User[],
		keys: (keyof User)[]
	): Promise<Omit<User, keyof User> | Omit<User, keyof User>[]> {
		const resolvedUser = await user

		if (Array.isArray(resolvedUser)) {
			return resolvedUser.map(u => this.excludeSingle(u, keys))
		} else {
			return this.excludeSingle(resolvedUser, keys)
		}
	}

	private excludeSingle(
		user: User,
		keys: (keyof User)[]
	): Omit<User, keyof User> {
		return Object.fromEntries(
			Object.entries(user).filter(([key]) => !keys.includes(key as keyof User))
		) as Omit<User, keyof User>
	}
}
