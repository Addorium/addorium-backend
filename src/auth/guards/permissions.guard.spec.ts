import { RolesService } from '@core/roles/roles.service'
import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { PermissionsGuard } from './permissions.guard'

describe('PermissionsGuard', () => {
	let permissionsGuard: PermissionsGuard
	let reflector: Reflector
	let rolesService: RolesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PermissionsGuard,
				{
					provide: Reflector,
					useValue: {
						getAllAndOverride: jest.fn()
					}
				},
				{
					provide: RolesService,
					useValue: {
						findOne: jest.fn()
					}
				}
			]
		}).compile()

		permissionsGuard = module.get<PermissionsGuard>(PermissionsGuard)
		reflector = module.get<Reflector>(Reflector)
		rolesService = module.get<RolesService>(RolesService)
	})

	const mockExecutionContext = (userPermissions: string[], roleId: string) => {
		return {
			switchToHttp: jest.fn(() => ({
				getRequest: () => ({
					user: {
						permissions: userPermissions,
						roleId
					}
				})
			})),
			getType: jest.fn(() => 'graphql'),
			getHandler: jest.fn(),
			getClass: jest.fn(),
			getArgs: jest.fn(() => []), // Обязательно для GraphQL
			getArgByIndex: jest.fn(), // Обязательно для GraphQL
			switchToRpc: jest.fn(),
			switchToWs: jest.fn()
		} as unknown as ExecutionContext
	}

	it('должно возвращать true, если у пользователя есть требуемое разрешение', async () => {
		const requiredPermissions = ['users:blueprint.update.icon']
		const userPermissions = ['users:blueprint.update.icon']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'user-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(true)
	})

	it('должно возвращать true, если у пользователя есть разрешение с подстановочным знаком, которое покрывает требуемое разрешение', async () => {
		const requiredPermissions = ['users:blueprint.update.icon']
		const userPermissions = ['users:blueprint.update.*']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'user-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(true)
	})

	it('должно возвращать true, если у пользователя есть разрешение более высокого уровня.', async () => {
		const requiredPermissions = ['users:blueprint.update.icon']
		const userPermissions = ['users:blueprint.*']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'user-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(true)
	})

	it('должно возвращать false, если у пользователя нет требуемого разрешения', async () => {
		const requiredPermissions = ['users:blueprint.update.icon']
		const userPermissions = ['users:blueprint.view.icon']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'user-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(false)
	})

	it('должно возвращать false, если пользователь имеет противоречивое разрешение', async () => {
		const requiredPermissions = ['users:blueprint.update.icon']
		const userPermissions = ['users:blueprint.update.banner']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'user-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(false)
	})

	it('должно возвращать true, если у администратора есть требуемое разрешение', async () => {
		const requiredPermissions = ['admin:blueprint.update.icon']
		const userPermissions = ['admin:blueprint.update.icon']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'admin-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(true)
	})

	it('должно возвращать true, если у администратора есть разрешение с подстановочным знаком, которое покрывает требуемое разрешение', async () => {
		const requiredPermissions = ['admin:blueprint.update.icon']
		const userPermissions = ['admin:blueprint.update.*']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'admin-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(true)
	})

	it('должно возвращать false, если у администратора нет необходимых прав', async () => {
		const requiredPermissions = ['admin:blueprint.update.icon']
		const userPermissions = ['admin:blueprint.view.icon']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'admin-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(false)
	})
	it('должно возвращать true, если у администратора есть доступ', async () => {
		const requiredPermissions = ['users:blueprint.update.icon']
		const userPermissions = ['admin:blueprint.update.*']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'admin-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(true)
	})
	it('должно вернуть false так как у users нету доступа к admin', async () => {
		const requiredPermissions = ['admin:blueprint.update.icon']
		const userPermissions = ['users:blueprint.update.*']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'admin-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(false)
	})
	it('должно вернуть true так как у admin есть доступ к admin', async () => {
		const requiredPermissions = ['admin:blueprint.update.icon']
		const userPermissions = ['admin:blueprint.update.*']

		jest
			.spyOn(reflector, 'getAllAndOverride')
			.mockReturnValue(requiredPermissions)
		jest.spyOn(rolesService, 'findOne').mockResolvedValue({
			id: 1,
			name: 'UserRole',
			permissions: userPermissions,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		})

		const context = mockExecutionContext(userPermissions, 'admin-role-id')

		const result = await permissionsGuard.canActivate(context)
		expect(result).toBe(true)
	})
})
