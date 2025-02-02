import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('healthy')
	healthy(): string {
		return this.appService.getHealthy()
	}

	@Get('permissions')
	getPermissions(): { permissions: string[] } {
		return this.appService.getPermissionList()
	}
}
