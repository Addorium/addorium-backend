import { BlueprintsService } from '@core/blueprints/blueprints.service'
import { GstorageService } from '@core/gstorage/gstorage.service'
import { User } from '@core/user/entity/user.entity'
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
					filename.toString()
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
		const data = await this.updateProjectImage(
			user,
			+project_id,
			location,
			type,
			filename
		)
		return { filename, url: uploadet_file, data }
	}

	public static imagesFilter(req, file, callback) {
		if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
			return callback(new Error('Only image files are allowed!'), false)
		}
		callback(null, true)
	}
	public static blueprintsFilter(req, file, callback) {
		if (!file.mimetype.match(/\/(bp)$/)) {
			return callback(new Error('Only blueprints files are allowed!'), false)
		}
		callback(null, true)
	}

	public static imagesInterceptorOptions = {
		fileFilter: UploadsService.imagesFilter,
		limits: { fileSize: 1024 * 1024 * 10, files: 1 }
	}
	public static blueprintsInterceptorOptions = {
		fileFilter: UploadsService.blueprintsFilter,
		limits: { fileSize: 1024 * 1024 * 10, files: 1 }
	}
}
