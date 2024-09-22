import { PrismaService } from '@core/prisma.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

@Module({
	controllers: [SessionsController],
	providers: [SessionsService, PrismaService, JwtService],
	exports: [SessionsService]
})
export class SessionsModule {}
