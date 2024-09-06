import { PrismaService } from '@core/prisma.service'
import { RolesService } from '@core/roles/roles.service'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
	imports: [
		JwtModule.register({
			secret: `jsdifjsiofjsldjfsoifuosdjfsido`
		})
	],
	providers: [UserResolver, UserService, PrismaService, RolesService],
	exports: [UserService]
})
export class UserModule {}
