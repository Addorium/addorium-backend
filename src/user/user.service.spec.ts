import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from './entity/user.entity'
import { UserService } from './user.service'

describe('UserService', () => {
	let service: UserService
	let prisma: PrismaService
	let user: User

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: PrismaService,
					useValue: {
						user: {
							create: jest.fn(),
							findUnique: jest.fn(),
							findFirst: jest.fn(),
							update: jest.fn(),
							remove: jest.fn()
						}
					}
				},
				{
					provide: JwtService,
					useValue: {}
				},
				{
					provide: GstorageService,
					useValue: {}
				}
			]
		}).compile()

		service = module.get<UserService>(UserService)
		prisma = module.get<PrismaService>(PrismaService)
		user = {
			id: 1,
			name: 'Test User',
			discordId: 'test-discord-id',
			email: 'test@test.com',
			emailVerified: new Date(),
			password: 'password',
			avatar: 'avatar.jpg',
			roleId: 1,
			refreshToken: 'token',
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			role: {
				id: 1,
				name: 'admin',
				permissions: [],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null
			}
		}
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('Create user', () => {
		it('Должен создать пользователя(create)', async () => {
			const createUserDto = {
				name: 'Test User',
				discordId: 'test-discord-id',
				email: 'test@test.com',
				password: 'password',
				roleId: 1
			}
			jest.spyOn(prisma.user, 'create').mockResolvedValue(user)

			expect(await service.create(createUserDto)).toEqual(user)
		})
	})

	describe('Getting user by id (getById)', () => {
		it('Должен вернуть пользователя, если он найден', async () => {
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user)

			expect(await service.getById('1')).toEqual(user)
		})

		it('Должен выбросить ошибку NotFoundException, если пользователь не найден', async () => {
			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)

			await expect(service.getById('1')).rejects.toThrow(NotFoundException)
		})
	})

	// describe('Getting user by discord id (getByDiscordId)', () => {
	// 	it('Должен вернуть пользователя, если он найден', async () => {
	// 		jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user)

	// 		expect(await service.getByDiscordId('test-discord-id')).toEqual(user)
	// 	})
	// 	it('Должен выбросить ошибку NotFoundException, если пользователь не найден', async () => {
	// 		jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)

	// 		await expect(service.getByDiscordId('0')).rejects.toThrow(
	// 			NotFoundException
	// 		)
	// 	})
	// })
	// describe('Delete user (remove)', () => {
	// 	it('Должен удалить пользователя', async () => {
	// 		jest.spyOn(prisma.user, 'delete').mockResolvedValue(user)

	// 		expect(await service.remove(1)).toEqual(user)
	// 	})
	// 	it('Должен выбросить ошибку NotFoundException, если пользователь не найден', async () => {
	// 		jest.spyOn(prisma.user, 'delete').mockResolvedValue(null)

	// 		await expect(service.remove(1)).rejects.toThrow(NotFoundException)
	// 	})
	// })
})
