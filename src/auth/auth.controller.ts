import { SessionsService } from '@core/sessions/sessions.service'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException
} from '@nestjs/common'
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { UserAgent } from './decorators/userAgent.decorator'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private sessionService: SessionsService
	) {}

	@Post('/discord?')
	@HttpCode(200)
	@ApiOkResponse({ description: 'Auth code' })
	async create(
		@Res({ passthrough: true }) response: Response,
		@UserAgent() userAgent: string,
		@Body() dto: AuthDto
	) {
		return await this.authService.auth(response, dto.code, userAgent)
	}
	@HttpCode(200)
	@Get('access-token')
	@ApiCookieAuth()
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const refreshTokenFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			const session = await this.sessionService.getSessionByRefreshToken(
				refreshTokenFromCookies
			)
			await this.sessionService.revokeUserSession(session.userId, session.id)
			return { message: 'Logout success', success: true }
		} else {
			return {
				message: 'Logout success, without tokens in cookies',
				success: true
			}
		}
		return { message: 'Logout success', success: true }
	}
}
