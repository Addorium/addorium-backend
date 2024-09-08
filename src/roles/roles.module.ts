import { PrismaService } from '@core/prisma.service'
import { Module } from '@nestjs/common'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'

@Module({
	controllers: [RolesController],
	providers: [RolesService, PrismaService],
	exports: [RolesService]
})
export class RolesModule {}
