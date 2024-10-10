import { SessionsService } from '@core/sessions/sessions.service'
import {
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private sessionService: SessionsService
	) {}

	@Get('/discord')
	@HttpCode(200)
	@UseGuards(AuthGuard('discord'))
	async discordLogin() {}

	@Get('/discord/callback')
	@UseGuards(AuthGuard('discord'))
	async discordCallback(@Req() req: Request, @Res() res: Response) {
		const forwarded = req.headers['x-forwarded-for'] as string
		const clientIp = forwarded
			? forwarded.split(',')[0].trim()
			: req.socket.remoteAddress

		await this.authService.auth(
			res,
			((req as any).user as any)?.id,
			req.headers['user-agent'],
			clientIp
		)
		return res.redirect(this.authService.FRONTEND_URL)
	}

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
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)
		this.authService.addAccessTokenToResponse(res, response.accessToken)

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
		return { message: 'Logout success', success: true }
	}
}
