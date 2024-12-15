import { SessionsService } from '@core/sessions/sessions.service'
import { User } from '@core/user/entity/user.entity'
import { UserService } from '@core/user/user.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'

@Injectable()
export class TokenService {
	private readonly EXPIRE_DAY_REFRESH_TOKEN = 1
	private readonly EXPIRE_MINUTE_ACCESS = 1
	private readonly REFRESH_TOKEN_NAME = 'refreshToken'
	private readonly ACCESS_TOKEN_NAME = 'accessToken'

	constructor(
		private readonly sessionsService: SessionsService,
		private readonly userService: UserService,
		private readonly jwt: JwtService,
		private readonly configService: ConfigService
	) {}

	public async storeRefreshTokenToDatabase(
		userId: number,
		input: {
			refreshToken: string
			userAgent: string
			ip: string
			os?: string
			osVersion?: string
			platform?: string
			city?: string
			country?: string
		}
	) {
		return this.sessionsService.putUserSession(userId, input)
	}

	public issueTokens(user: User) {
		const accessData = {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role
		}
		const refreshData = { id: user.id }

		const accessToken = this.jwt.sign(accessData, { expiresIn: '1m' })
		const refreshToken = this.jwt.sign(refreshData, { expiresIn: '7d' })

		return { accessToken, refreshToken }
	}

	async getNewTokens(refreshToken: string, res: Response) {
		try {
			const result = await this.jwt.verifyAsync(refreshToken)
			const session =
				await this.sessionsService.getSessionByRefreshToken(refreshToken)

			if (!session || session.revokedAt) {
				this.removeRefreshTokenFromResponse(res)
				throw new UnauthorizedException('Invalid or revoked refresh token')
			}

			const user = await this.userService.getById(result.id.toString())
			const tokens = this.issueTokens(user)
			await this.sessionsService.updateRefreshToken(
				session.id,
				tokens.refreshToken
			)

			return { user, ...tokens }
		} catch (error) {
			this.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Invalid refresh token')
		}
	}

	getRefreshTokenFromCookies(req: Request): string | undefined {
		return req.cookies[this.REFRESH_TOKEN_NAME]
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.configService.get<string>('FRONTEND_DOMAIN'),
			expires: expiresIn,
			secure: true,
			sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.configService.get<string>('FRONTEND_DOMAIN'),
			expires: new Date(0),
			secure: true,
			sameSite: 'none'
		})
	}
}
