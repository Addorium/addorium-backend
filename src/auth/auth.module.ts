import { BlueprintsService } from '@core/blueprints/blueprints.service'
import { getJwtConfig } from '@core/config/jwt.config'
import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { SessionsService } from '@core/sessions/sessions.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { UserModule } from '@core/user/user.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		UserModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		SessionsService,
		PrismaService,
		UploadsService,
		GstorageService,
		BlueprintsService
	]
})
export class AuthModule {}
