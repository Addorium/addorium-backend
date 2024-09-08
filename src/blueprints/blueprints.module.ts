import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { UserService } from '@core/user/user.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { BlueprintsController } from './blueprints.controller'
import { BlueprintsService } from './blueprints.service'

@Module({
	controllers: [BlueprintsController],
	providers: [
		BlueprintsService,
		PrismaService,
		RolesService,
		UploadsService,
		GstorageService,
		UserService,
		JwtService
	],
	exports: [BlueprintsService]
})
export class BlueprintsModule {}
