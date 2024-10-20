import { GstorageService } from '@core/gstorage/gstorage.service'
import { PaginatedResult, PaginateFunction, paginator } from '@core/paginator'
import { PrismaService } from '@core/prisma.service'
import { UploadsService } from '@core/uploads/uploads.service'
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
		private jwtService: JwtService,
		private gstorage: GstorageService
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
		const { search, ...filter } = sfilter

		const response = await this.paginate<ClearUser, any>(
			this.prisma.user,
			{
				where: {
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
	async getById(id: string): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id: +id },
			include: { role: true }
		})
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return user
	}
	async getByDiscordId(id: string): Promise<User> {
		if (!id) {
			throw new NotFoundException('Discord id is required')
		}
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
		const user = await this.getById(userId.toString())
		if (!user) {
			throw new NotFoundException('[r] User not found')
		}
		return await this.prisma.user.update({
			where: { id: +userId },
			data: { refreshToken: refreshToken }
		})
	}
	async update(updateUserDto: UpdateUserInput): Promise<ClearUser> {
		const user = await this.getById(updateUserDto.id.toString())
		if (!user) {
			throw new NotFoundException('[u] User not found')
		}
		return this.prisma.user.update({
			where: { id: updateUserDto.id },
			data: { ...updateUserDto, roleId: +updateUserDto.roleId },
			include: { role: true }
		})
	}

	async updateUaerAvatar(id: number, avatar: string): Promise<User> {
		const user = await this.getById(id.toString())
		if (!user) {
			throw new NotFoundException('[ua] User not found')
		}
		return this.prisma.user.update({
			where: { id: +id },
			data: { avatar: avatar },
			include: { role: true }
		})
	}
	async clearAvatar(user: User): Promise<{ success: boolean }> {
		const avatar = await UploadsService.downloadImageAsMulterFile(
			'https://api.dicebear.com/9.x/identicon/webp?seed=' + user.name
		)
		this.uploadAvatarImage(avatar, user)
		return { success: true }
	}

	async remove(id: number): Promise<User> {
		const user = await this.getById(id.toString())
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return this.prisma.user.delete({
			where: { id: +id },
			include: { role: true }
		})
	}

	async uploadAvatarImage(file: Express.Multer.File, user: User) {
		const prevAvatar = user.avatar
		if (prevAvatar !== 'default.webp') {
			const { url: prevUrl } = UploadsService.getFullFileName(
				'user',
				'avatar',
				prevAvatar
			)
			try {
				await this.gstorage.deleteFile(prevUrl)
			} catch (error) {}
		}
		const webpBuffer = await UploadsService.convertToWebP(file.buffer)
		const { filename, url } = UploadsService.getFullFileName('user', 'avatar')
		const uploadet_file = await this.gstorage.uploadFile(url, webpBuffer)
		const responce = await this.updateUaerAvatar(user.id, filename)
		return {
			filename: filename,
			url: uploadet_file,
			user: responce
		}
	}
}
