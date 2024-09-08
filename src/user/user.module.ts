import { BlueprintsService } from '@core/blueprints/blueprints.service'
import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [
		JwtModule.register({
			secret: `jsdifjsiofjsldjfsoifuosdjfsido`
		})
	],
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		RolesService,
		UploadsService,
		GstorageService,
		BlueprintsService
	],
	exports: [UserService]
})
export class UserModule {}
