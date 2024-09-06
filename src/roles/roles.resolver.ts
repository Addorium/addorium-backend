import { Permission } from '@core/auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateRoleInput } from './dto/create-role.input'
import { UpdateRoleInput } from './dto/update-role.input'
import { Role } from './entities/role.entity'
import { RolesService } from './roles.service'

@Resolver(() => Role)
export class RolesResolver {
	constructor(private readonly rolesService: RolesService) {}

	@Mutation(() => Role)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:roles.create')
	async createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
		return await this.rolesService.create(createRoleInput)
	}

	@Query(() => [Role], { name: 'roles' })
	findAll() {
		return this.rolesService.findAll()
	}

	@Query(() => Role, { name: 'role' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.rolesService.findOne(id)
	}

	@Mutation(() => Role)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:roles.update')
	updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
		return this.rolesService.update(updateRoleInput.id, updateRoleInput)
	}

	@Mutation(() => Role)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:roles.delete')
	removeRole(@Args('id', { type: () => Int }) id: number) {
		return this.rolesService.remove(id)
	}
}
