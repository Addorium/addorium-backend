import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { UserService } from '@core/user/user.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'

@Module({
	controllers: [ProjectsController],
	providers: [
		ProjectsService,
		PrismaService,
		RolesService,
		UploadsService,
		GstorageService,
		UserService,
		JwtService
	],
	exports: [ProjectsService]
})
export class ProjectsModule {}
