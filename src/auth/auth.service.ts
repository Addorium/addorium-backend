import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import axios from 'axios'
import { Response } from 'express'
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
		private configService: ConfigService
	) {}
	FRONTEND_URL = this.configService.get('FRONTEND_URL')
	// REDIRECT_URI = this.FRONTEND_URL + '/auth'
	REDIRECT_URI = 'http://localhost:4200/api/auth/discord'

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
	async auth(response: Response, code: string) {
		const discordUser = await this.discordLogin(code)

		let user: User = await this.validateUser(discordUser.discordUserId)
		if (!user) {
			user = await this.register(discordUser)
		}
		const tokens = this.issueTokens(user.id)
		this.storeRefreshTokenToDatabase(user.id, tokens.refreshToken)
		this.addRefreshTokenToResponse(response, tokens.refreshToken)
		return {
			user,
			...tokens
		}
	}
	async register(discordUser: any): Promise<User> {
		return await this.userService.create({
			name: discordUser.discordUsername,
			discordId: discordUser.discordUserId,
			avatar: discordUser.discordAvatar
		})
	}
	private storeRefreshTokenToDatabase(userId: number, refreshToken: string) {
		this.userService.storeRefreshToken(refreshToken, userId)
	}
	private issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const user = await this.userService.getById(result.id)
		this.storeRefreshTokenToDatabase(user.id, refreshToken)
		const tokens = this.issueTokens(user.id)

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
}
