import { PrismaService } from '@core/prisma.service'
import { Injectable } from '@nestjs/common'
import { Session } from './entities/session.entity'

@Injectable()
export class SessionsService {
	constructor(private prismaService: PrismaService) {}

	async putUserSession(
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
		const reqSession = await this.getSessionByRefreshToken(input.refreshToken)
		if (reqSession) {
			await this.deleteRefreshToken(input.refreshToken)
		}

		const session = await this.prismaService.userSession.create({
			data: {
				userId: +userId,
				refreshToken: input.refreshToken,
				userAgent: input.userAgent,
				ip: input.ip,
				os: input.os,
				osVersion: input.osVersion,
				platform: input.platform,
				city: input.city,
				country: input.country
			}
		})
		return session
	}

	async findAllUserSessions(userId: number) {
		const sessions = await this.prismaService.userSession.findMany({
			where: {
				userId: +userId
			},
			select: {
				id: true,
				userId: true,
				userAgent: true,
				ip: true,
				createdAt: true,
				revokedAt: true,
				refreshToken: false
			}
		})
		return sessions
	}

	async findOneUserSession(userId: number, sessionId: number) {
		const session = await this.prismaService.userSession.findMany({
			where: {
				userId: +userId,
				id: +sessionId
			},
			select: {
				id: true,
				userId: true,
				userAgent: true,
				ip: true,
				createdAt: true,
				revokedAt: true
			}
		})
		return session
	}

	async revokeUserSession(userId: number, sessionId: number) {
		const session = await this.prismaService.userSession.update({
			where: {
				userId: +userId,
				id: +sessionId
			},
			data: {
				revokedAt: new Date()
			},
			select: {
				id: true,
				userId: true,
				userAgent: true,
				ip: true,
				createdAt: true,
				revokedAt: true
			}
		})
		return session
	}

	async updateRefreshToken(
		sessionId: number,
		refreshToken: string
	): Promise<Omit<Session, 'refreshToken'>> {
		const session = await this.prismaService.userSession.update({
			where: {
				id: +sessionId
			},
			data: {
				refreshToken: refreshToken
			},
			select: {
				id: true,
				userId: true,
				userAgent: true,
				ip: true,
				os: true,
				osVersion: true,
				platform: true,
				city: true,
				country: true,
				createdAt: true,
				revokedAt: true
			}
		})
		return session
	}

	async deleteRefreshToken(refreshToken: string) {
		const session = await this.prismaService.userSession.delete({
			where: {
				refreshToken: refreshToken
			}
		})
		return session
	}
	async getSessionByRefreshToken(
		refreshToken: string
	): Promise<Omit<Session, 'refreshToken'>> {
		const session = await this.prismaService.userSession.findUnique({
			where: {
				refreshToken: refreshToken
			},
			select: {
				id: true,
				userId: true,
				userAgent: true,
				ip: true,
				os: true,
				osVersion: true,
				platform: true,
				city: true,
				country: true,
				createdAt: true,
				revokedAt: true
			}
		})
		if (!session) {
			return null
		}
		return session
	}
}
