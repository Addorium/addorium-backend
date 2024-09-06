import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { Module } from '@nestjs/common'
import { BlueprintsResolver } from './blueprints.resolver'
import { BlueprintsService } from './blueprints.service'

@Module({
	providers: [
		BlueprintsResolver,
		BlueprintsService,
		PrismaService,
		RolesService
	],
	exports: [BlueprintsService]
})
export class BlueprintsModule {}
