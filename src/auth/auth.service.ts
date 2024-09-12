import { SessionsService } from '@core/sessions/sessions.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'
import { Response } from 'express'
import { Readable } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { UserService } from '../user/user.service'

const API_ENDPOINT = 'https://discord.com/api/v10'
const TOCKEN_URL = 'https://discord.com/api/oauth2/token'
const CLIENT_ID = '1277307705463275611'
const CLIENT_SECRET = 'ixQAoHROF4e-ngzxYDrMi9CqGQNXTol6'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService,
		private sessionsService: SessionsService,
		private uploadsService: UploadsService
	) {}
	FRONTEND_URL = this.configService.get('FRONTEND_URL')
	REDIRECT_URI = this.FRONTEND_URL + '/auth/discord'
	//REDIRECT_URI = 'http://localhost:4200/api/v1/auth/discord'

	public token = 'none'

	async validateUser(id: string) {
		const user = await this.userService.getByDiscordId(id)
		if (!user) {
			return null
		}
		return user
	}
	async discordLogin(code: string) {
		const body = {
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: this.REDIRECT_URI
		}
		const data = Object.keys(body)
			.map(key => `${key}=${encodeURIComponent(body[key])}`)
			.join('&')
		const options = {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			data,
			url: TOCKEN_URL
		}
		let token = null
		try {
			token = await axios(options)
		} catch (error) {
			throw new UnauthorizedException('Invalid code')
		}
		const [accessToken, tokenType] = [
			token.data['access_token'],
			token.data['token_type']
		]
		const discordUser = await axios.get(API_ENDPOINT + '/users/@me', {
			headers: { authorization: tokenType + ' ' + accessToken }
		})
		const [discordUsername, discordUserId] = [
			discordUser.data['username'],
			discordUser.data['id']
		]
		return { discordUsername, discordUserId }
	}
	async auth(response: Response, code: string, userAgent: string) {
		const discordUser = await this.discordLogin(code)

		let user: User = await this.validateUser(discordUser.discordUserId)
		if (!user) {
			user = await this.register(discordUser)
		}
		const tokens = this.issueTokens(user.id)
		this.storeRefreshTokenToDatabase(user.id, {
			refreshToken: tokens.refreshToken,
			userAgent: userAgent,
			ip: ''
		})
		this.addRefreshTokenToResponse(response, tokens.refreshToken)
		return {
			user,
			...tokens
		}
	}
	async register(discordUser: any): Promise<User> {
		const user = await this.userService.create({
			discordId: discordUser.discordUserId,
			name: discordUser.discordUsername
		})
		const avatar = await this.downloadImageAsMulterFile(
			'https://api.dicebear.com/9.x/identicon/webp?seed=' + user.name
		)
		await this.uploadsService.uploadImage(
			user,
			avatar,
			user.id.toString(),
			'avatar',
			'user'
		)
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
			domain: 'localhost',
			expires: expiresIn,
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}
	private async downloadImageAsMulterFile(
		url: string
	): Promise<Express.Multer.File> {
		const response = await axios.get(url, { responseType: 'arraybuffer' })
		const buffer = Buffer.from(response.data, 'binary')

		const file: Express.Multer.File = {
			fieldname: 'file',
			originalname: `${uuidv4()}.webp`, // или другой формат, в зависимости от типа изображения
			encoding: '7bit',
			mimetype: response.headers['content-type'],
			size: buffer.length,
			stream: Readable.from(buffer),
			destination: '',
			filename: '',
			path: '',
			buffer: buffer
		}

		return file
	}
}
