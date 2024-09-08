import { Permission } from '@core/auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@core/auth/guards/auth.guard'
import { PermissionsGuard } from '@core/auth/guards/permissions.guard'
import { PaginatedResult } from '@core/paginator'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateRoleInput } from './dto/create-role.input'
import { UpdateRoleInput } from './dto/update-role.input'
import { Role } from './entities/role.entity'
import { RolesService } from './roles.service'

@Controller('roles')
@ApiTags('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:roles.create')
	async createRole(@Body() createRoleInput: CreateRoleInput): Promise<Role> {
		return await this.rolesService.create(createRoleInput)
	}

	@Get()
	async findAll(@Query('page') page: number): Promise<PaginatedResult<Role>> {
		return await this.rolesService.findAll(page)
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<Role> {
		return await this.rolesService.findOne(+id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:roles.update')
	async updateRole(
		@Param('id') id: number,
		@Body() updateRoleInput: UpdateRoleInput
	): Promise<Role> {
		return await this.rolesService.update(id, updateRoleInput)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permission('admin:roles.delete')
	async removeRole(@Param('id') id: number): Promise<Role> {
		return await this.rolesService.remove(id)
	}
}
