import { Controller, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'
import geoip from 'geoip-lite'
import { UAParser } from 'ua-parser-js'
import { AuthService } from '../auth.service'

@Controller('discord')
export class SocialDiscordController {
	constructor(private readonly authService: AuthService) {}

	@Get('/')
	@HttpCode(200)
	@UseGuards(AuthGuard('discord'))
	async discordLogin() {}

	@Get('/callback')
	@UseGuards(AuthGuard('discord'))
	async discordCallback(@Req() req: Request, @Res() res: Response) {
		let clientIp: string

		if (process.env.NODE_ENV === 'development') {
			clientIp = '127.0.0.1'
		} else {
			const forwarded =
				(req.headers['cf-connecting-ip'] as string) ||
				(req.headers['x-forwarded-for'] as string)
			clientIp = forwarded
				? forwarded.split(',')[0].trim()
				: req.socket.remoteAddress
		}

		const geo = geoip.lookup(clientIp)
		const loginLocation = geo ? geo.country : 'Unknown'

		const parser = new UAParser(req.headers['user-agent'])
		const os = parser.getOS().name
		const osVersion = parser.getOS().version
		const platform = parser.getResult().ua
		const city = geo ? geo.city : 'Unknown'

		const response = await this.authService.auth(
			res,
			((req as any).user as any)?.id,
			{
				userAgent: req.headers['user-agent'],
				ip: clientIp,
				os: os,
				osVersion: osVersion,
				platform: platform,
				city: city,
				country: loginLocation
			}
		)
		return res.redirect(
			this.authService.FRONTEND_URL +
				'/auth/social/discord?accessToken=' +
				response.accessToken
		)
	}
}
