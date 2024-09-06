import { Permission } from '@core/auth/decorators/roles.decorator'
import { CurrentUser } from '@core/auth/decorators/user.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { User } from '@core/user/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { BlueprintsService } from './blueprints.service'
import { CreateBlueprintInput } from './dto/create-blueprint.input'
import { UpdateBlueprintInput } from './dto/update-blueprint.input'
import { Blueprint } from './entities/blueprint.entity'

@Resolver(() => Blueprint)
export class BlueprintsResolver {
	constructor(private readonly blueprintsService: BlueprintsService) {}

	@Mutation(() => Blueprint)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprint.create')
	async createBlueprint(
		@CurrentUser() user: User,
		@Args('createBlueprintInput') createBlueprintInput: CreateBlueprintInput
	) {
		return await this.blueprintsService.create(user, createBlueprintInput)
	}

	@Query(() => [Blueprint], { name: 'blueprints' })
	async findAll() {
		return await this.blueprintsService.findAll()
	}

	@Query(() => Blueprint, { name: 'blueprint' })
	async findOne(@Args('id', { type: () => Int }) id: number) {
		return await this.blueprintsService.findOne(id)
	}

	@Mutation(() => Blueprint)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprints.update')
	async updateBlueprint(
		@CurrentUser() user: User,
		@Args('updateBlueprintInput') updateBlueprintInput: UpdateBlueprintInput
	) {
		return await this.blueprintsService.update(user, updateBlueprintInput)
	}

	@Mutation(() => Blueprint)
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('users:blueprints.delete')
	async removeBlueprint(
		@CurrentUser() user: User,
		@Args('id', { type: () => Int }) id: number
	) {
		return await this.blueprintsService.remove(user, id)
	}
}
