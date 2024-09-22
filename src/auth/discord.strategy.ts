import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-discord'

import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
const REDIRECT_URI = 'http://localhost:4200/api/v1' + '/auth/discord/callback'
@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
	constructor(
		private authService: AuthService,
		private configService: ConfigService
	) {
		super({
			clientID: configService.get('DISCORD_CLIENT_ID'),
			clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
			callbackURL: REDIRECT_URI,
			scope: ['identify', 'email']
		})
	}

	async validate(access_token: string, refresh_token: string, profile: any) {
		const user = await this.authService.validateDiscordUser(profile)
		if (!user) {
			throw new UnauthorizedException('Invalid user')
		}
		return user
	}
}
