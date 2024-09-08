import { RolesService } from '@core/roles/roles.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../decorators/roles.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private rolesService: RolesService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
			PERMISSIONS_KEY,
			[context.getHandler(), context.getClass()]
		)
		if (!requiredPermissions) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const { user } = request
		const role = await this.rolesService.findOne(user.roleId)
		const userPermissions = role.permissions

		for (const requiredPermission of requiredPermissions) {
			if (
				this.rolesService.hasPermission(userPermissions, requiredPermission)
			) {
				return true
			}
		}
		return false
	}
}
