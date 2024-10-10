import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { Module } from '@nestjs/common'
import { TagsController } from './tags.controller'
import { TagsService } from './tags.service'

@Module({
	controllers: [TagsController],
	providers: [TagsService, PrismaService, GstorageService, RolesService]
})
export class TagsModule {}
