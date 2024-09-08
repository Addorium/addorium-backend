import { PrismaService } from '@core/prisma.service'
import { UserService } from '@core/user/user.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

@Module({
	controllers: [SessionsController],
	providers: [SessionsService, UserService, PrismaService, JwtService],
	exports: [SessionsService]
})
export class SessionsModule {}
