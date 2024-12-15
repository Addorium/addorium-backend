import { UploadsService } from '@core/uploads/uploads.service'
import { User } from '@core/user/entity/user.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { TokenService } from './token.service'
import { GeoEntity } from './entity/geo.entity'

@Injectable()
export class AuthService {
	public readonly FRONTEND_URL: string

	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly tokenService: TokenService
	) {
		this.FRONTEND_URL = this.configService.get<string>('FRONTEND_URL')
	}

	public token = 'none'

	async validateDiscordUser(profile: {
		id: string
		username: string
		global_name: string
		email: string
	}): Promise<User> {
		let user = await this.userService.getByDiscordId(profile.id)
		if (!user) {
			user = await this.discordRegister(profile)
		}
		return user
	}

	async validateUser(id: string): Promise<User | null> {
		const user = await this.userService.getById(id)
		return user || null
	}

	async auth(response: Response, id: string, geo: GeoEntity) {
		const user = await this.validateUser(id)
		if (!user) {
			throw new UnauthorizedException('User not found')
		}
		const tokens = this.tokenService.issueTokens(user)
		await this.tokenService.storeRefreshTokenToDatabase(user.id, {
			refreshToken: tokens.refreshToken,
			userAgent: geo.userAgent,
			ip: geo.ip,
			os: geo.os,
			osVersion: geo.osVersion,
			platform: geo.platform,
			city: geo.city,
			country: geo.country
		})
		this.tokenService.addRefreshTokenToResponse(response, tokens.refreshToken)
		return { user, ...tokens }
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
			`https://api.dicebear.com/9.x/identicon/webp?seed=${user.name}`
		)
		await this.userService.uploadAvatarImage(avatar, user)
		return user
	}
}
