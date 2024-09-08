import { Controller, Delete, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SessionsService } from './sessions.service'

@Controller('sessions')
@ApiTags('sessions')
export class SessionsController {
	constructor(private readonly sessionsService: SessionsService) {}

	@Get('/:userId')
	findAll(@Param('userId') userId: string) {
		return this.sessionsService.findAllUserSessions(+userId)
	}

	@Get('/:userId/:sessionId')
	findOne(
		@Param('userId') userId: string,
		@Param('sessionId') sessionId: string
	) {
		return this.sessionsService.findOneUserSession(+userId, +sessionId)
	}

	@Delete('revoke/:userId/:sessionId')
	revoke(
		@Param('userId') userId: string,
		@Param('sessionId') sessionId: string
	) {
		const session = this.sessionsService.revokeUserSession(+userId, +sessionId)
		return {
			message: `Session ${sessionId} for user ${userId} has been revoked`,
			status: 'success',
			session: session
		}
	}
}
