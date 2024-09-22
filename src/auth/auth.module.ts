import { getJwtConfig } from '@core/config/jwt.config'
import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { SessionsService } from '@core/sessions/sessions.service'
import { UserModule } from '@core/user/user.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DiscordStrategy } from './discord.strategy'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		UserModule,
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
		DiscordStrategy,
		SessionsService,
		PrismaService,
		GstorageService,
		ConfigService
	]
})
export class AuthModule {}
