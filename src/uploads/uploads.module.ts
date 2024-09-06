import { BlueprintsService } from '@core/blueprints/blueprints.service'
import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { UserService } from '@core/user/user.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UploadsController } from './uploads.controller'
import { UploadsService } from './uploads.service'

@Module({
	controllers: [UploadsController],
	providers: [
		UploadsService,
		PrismaService,
		RolesService,
		GstorageService,
		BlueprintsService,
		UserService,
		JwtService
	]
})
export class UploadsModule {}
