import { PrismaService } from '@core/prisma.service'
import { Module } from '@nestjs/common'
import { RolesResolver } from './roles.resolver'
import { RolesService } from './roles.service'

@Module({
	providers: [RolesResolver, RolesService, PrismaService],
	exports: [RolesService]
})
export class RolesModule {}
