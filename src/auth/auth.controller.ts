import { SessionsService } from '@core/sessions/sessions.service'
import {
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException
} from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { TokenService } from './token.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private sessionService: SessionsService,
		private tokenService: TokenService
	) {}

	@Post('login')
	async login() {
		return { message: 'Login success', success: true }
	}

	@HttpCode(200)
	@Post('access-token')
	@ApiCookieAuth()
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies =
			this.tokenService.getRefreshTokenFromCookies(req)

		if (!refreshTokenFromCookies) {
			this.tokenService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.tokenService.getNewTokens(
			refreshTokenFromCookies,
			res
		)

		this.tokenService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const refreshTokenFromCookies =
			this.tokenService.getRefreshTokenFromCookies(req)

		if (refreshTokenFromCookies) {
			this.tokenService.removeRefreshTokenFromResponse(res)
			const session = await this.sessionService.getSessionByRefreshToken(
				refreshTokenFromCookies
			)
			if (session) {
				await this.sessionService.revokeUserSession(session.userId, session.id)
			}
			return { message: 'Logout success', success: true }
		} else {
			return {
				message: 'Logout success, without tokens in cookies',
				success: true
			}
		}
	}
}
