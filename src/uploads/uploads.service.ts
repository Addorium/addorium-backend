import { BlueprintsService } from '@core/blueprints/blueprints.service'
import { GstorageService } from '@core/gstorage/gstorage.service'
import { User } from '@core/user/entities/user.entity'
import { UserService } from '@core/user/user.service'
import { Injectable } from '@nestjs/common'
import * as sharp from 'sharp'
import { Location, Type } from './dto/upload-image.dto'

@Injectable()
export class UploadsService {
	constructor(
		private gstorage: GstorageService,
		private blueprintService: BlueprintsService,
		private userService: UserService
	) {}
	private async convertToWebP(buffer: Buffer): Promise<Buffer> {
		return await sharp(buffer).webp().toBuffer()
	}
	private getFullFileName(
		location: Location,
		type: Type,
		object_id: string
	): { filename: string; url: string } {
		const full_filename = `${object_id}.webp`
		if (!type) {
			throw new Error('Type is required')
		}
		switch (location) {
			case 'blueprint':
				return {
					filename: full_filename,
					url: `images/blueprints/${type}/${full_filename}`
				}
			case 'script':
				return {
					filename: full_filename,
					url: `images/scripts/${type}/${full_filename}`
				}
			case 'theme':
				return {
					filename: full_filename,
					url: `images/themes/${type}/${full_filename}`
				}
			case 'user':
				return {
					filename: full_filename,
					url: `images/users/${type}/${full_filename}`
				}
			default:
				throw new Error('Location is required')
		}
	}
	private async updateProjectImage(
		user: User,
		object_id: number,
		location: Location,
		type: Type,
		filename: string
	) {
		switch (location) {
			case 'blueprint':
				return await this.blueprintService.updateImage(
					user,
					object_id,
					type,
					filename
				)
			case 'user':
				return await this.userService.updateUaerAvatar(
					user.id,
					object_id.toString()
				)
			default:
				return
		}
	}

	async uploadImage(
		user: User,
		file: Express.Multer.File,
		project_id: string,
		type: Type,
		location: Location
	) {
		const webpBuffer = await this.convertToWebP(file.buffer)
		const { filename, url } = this.getFullFileName(location, type, project_id)
		const uploadet_file = await this.gstorage.uploadFile(url, webpBuffer)
		const project = await this.updateProjectImage(
			user,
			+project_id,
			location,
			type,
			filename
		)
		return { filename, url: uploadet_file, project }
	}

	async uploadScript(user: User, file: Express.Multer.File) {
		return null
	}

	async uploadBlueprint(user: User, file: Express.Multer.File) {
		return null
	}
}
