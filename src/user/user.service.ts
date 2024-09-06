import { PrismaService } from '@core/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma, User } from '@prisma/client'
import { UpdateUserInput } from './dto/update-user.input'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
		return await this.prisma.user.create({
			data: createUserDto
		})
	}

	async getAll(): Promise<User[]> {
		const users = await this.prisma.user.findMany()
		return users
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
		const user = await this.prisma.user.findFirst({ where: { discordId: id } })
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
			data: updateUserDto
		})
	}

	async updateUaerAvatar(id: number, avatar: string): Promise<User> {
		const user = await this.getById(id)
		if (!user) {
			throw new NotFoundException('[ua] User not found')
		}
		return this.prisma.user.update({
			where: { id: id },
			data: { avatar: avatar }
		})
	}

	async remove(id: number): Promise<User> {
		const user = await this.getById(id)
		if (!user) {
			throw new NotFoundException('[r] User not found')
		}
		return this.prisma.user.delete({ where: { id: id } })
	}
}
