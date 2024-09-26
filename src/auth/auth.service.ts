import { SessionsService } from '@core/sessions/sessions.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'
	ACCESS_TOKEN_NAME = 'accessToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService,
		private sessionsService: SessionsService
	) {}
	FRONTEND_URL = this.configService.get('FRONTEND_URL')
	REDIRECT_URI = this.FRONTEND_URL + '/auth/discord'
	//REDIRECT_URI = 'http://localhost:4200/api/v1/auth/discord'

	public token = 'none'
	async validateDiscordUser(profile: {
		id: string
		username: string
		global_name: string
		email: string
	}) {
		let user = await this.userService.getByDiscordId(profile.id)
		if (!user) {
			user = await this.discordRegister(profile)
			return user
		}
		return user
	}
	async validateUser(id: string) {
		const user = await this.userService.getById(id)
		if (!user) {
			return null
		}
		return user
	}
	async auth(response: Response, id: string, userAgent: string, ip: string) {
		const user: User = await this.validateUser(id)
		const tokens = this.issueTokens(user.id)
		this.storeRefreshTokenToDatabase(user.id, {
			refreshToken: tokens.refreshToken,
			userAgent: userAgent,
			ip: ip
		})
		this.addRefreshTokenToResponse(response, tokens.refreshToken)
		this.addAccessTokenToResponse(response, tokens.accessToken)
		return {
			user,
			...tokens
		}
	}
	async discordRegister(discordUser: {
		id: string
		username: string
		global_name: string
		email: string
	}): Promise<User> {
		const user = await this.userService.create({
			discordId: discordUser.id,
			name: discordUser.username,
			email: discordUser.email
		})
		const avatar = await UploadsService.downloadImageAsMulterFile(
			'https://api.dicebear.com/9.x/identicon/webp?seed=' + user.name
		)
		await this.userService.uploadAvatarImage(avatar, user)
		return user
	}
	private storeRefreshTokenToDatabase(
		userId: number,
		input: { refreshToken: string; userAgent: string; ip: string }
	) {
		const session = this.sessionsService.putUserSession(userId, input)
		return session
	}
	private issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1m'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) {
			const badSession =
				await this.sessionsService.getSessionByRefreshToken(refreshToken)
			if (badSession) {
				await this.sessionsService.revokeUserSession(
					badSession.userId,
					badSession.id
				)
			}
			throw new UnauthorizedException('Invalid refresh token')
		}
		let session =
			await this.sessionsService.getSessionByRefreshToken(refreshToken)
		if (!session) {
			throw new UnauthorizedException('Invalid refresh token')
		}
		if (session.revokedAt) {
			throw new UnauthorizedException('Refresh token has been revoked')
		}

		const user = await this.userService.getById(result.id.toString())

		const tokens = this.issueTokens(user.id)
		session = await this.sessionsService.updateRefreshToken(
			session.id,
			tokens.refreshToken
		)

		return {
			user,
			...tokens
		}
	}
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.configService.get('FRONTEND_DOMAIN'),
			expires: expiresIn,
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}
	addAccessTokenToResponse(res: Response, accessToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
		res.cookie(this.ACCESS_TOKEN_NAME, accessToken, {
			httpOnly: false,
			domain: this.configService.get('FRONTEND_DOMAIN'),
			expires: expiresIn,
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.configService.get('FRONTEND_DOMAIN'),
			expires: new Date(0),
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}
}
