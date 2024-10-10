import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

@Module({
	controllers: [CategoriesController],
	providers: [CategoriesService, PrismaService, GstorageService, RolesService]
})
export class CategoriesModule {}
