import {
	Controller,
	Get,
	HttpCode,
	Logger,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import axios from 'axios'
import { Request, Response } from 'express'
import { UAParser } from 'ua-parser-js'
import { AuthService } from '../auth.service'

@Controller('auth/discord')
export class SocialDiscordController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

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

		const geo = await getGeoLocation(clientIp, this.configService)
		const loginLocation = geo ? geo.country_name : 'Unknown'

		const parser = new UAParser(req.headers['user-agent'])
		const os = parser.getOS().name
		const osVersion = parser.getOS().version
		const platform = parser.getResult().browser.name
		const city = geo ? geo.city_name : 'Unknown'

		Logger.log(
			`User ${((req as any).user as any)?.id} logged in from ${loginLocation} ${city} ${os} ${osVersion} ${platform}`
		)

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
async function getGeoLocation(
	clientIp: string,
	configService: ConfigService
): Promise<{ country_name: string; city_name: string; region_name: string }> {
	const apiKey = configService.get('IP2LOCATION_API_KEY')
	try {
		const geoResponse = await axios.get(
			`https://api.ip2location.io/?key=${apiKey}&ip=${clientIp}`
		)
		const geoData = geoResponse.data
		return {
			country_name: geoData.country_name || 'Unknown',
			city_name: geoData.city_name || 'Unknown',
			region_name: geoData.region_name || 'Unknown'
		}
	} catch (error) {
		Logger.error('Error fetching geo location:', error)
		return {
			country_name: 'Unknown',
			city_name: 'Unknown',
			region_name: 'Unknown'
		}
	}
}
