import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
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
		GstorageService,
		JwtService
	],
	exports: [UserService]
})
export class UserModule {}
