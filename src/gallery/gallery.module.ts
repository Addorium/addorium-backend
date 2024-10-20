import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { ProjectsService } from '@core/projects/projects.service'
import { RolesService } from '@core/roles/roles.service'
import { Module } from '@nestjs/common'
import { GalleryController } from './gallery.controller'
import { GalleryService } from './gallery.service'

@Module({
	imports: [],
	controllers: [GalleryController],
	providers: [
		GalleryService,
		RolesService,
		ProjectsService,
		PrismaService,
		GstorageService
	],
	exports: [GalleryService]
})
export class GalleryModule {}
