import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class AppService {
	getHealthy(): string {
		return 'Healthy'
	}
	getPermissionList(): { permissions: string[] } {
		const filePath = path.join(process.cwd(), 'permissions.txt')

		try {
			const data = fs.readFileSync(filePath, 'utf-8')
			const permissions = data
				.split('\n')
				.map(p => p.trim())
				.filter(Boolean)
			return { permissions }
		} catch (error) {
			console.error('Error reading permissions.txt:', error)
			return { permissions: [] }
		}
	}
}
