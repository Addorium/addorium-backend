import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as sharp from 'sharp'
import { Readable } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { Location, Type } from './dto/upload-image.dto'

@Injectable()
export class UploadsService {
	constructor() {}
	public static async convertToWebP(buffer: Buffer): Promise<Buffer> {
		return await sharp(buffer).webp().toBuffer()
	}
	public static getFullFileName(
		location: Location,
		type: Type,
		filename?: string
	): { filename: string; url: string } {
		const uuid = uuidv4()
		const full_filename = filename ? `${filename}` : `${uuid}.webp`
		if (!type) {
			throw new Error('Type is required')
		}
		switch (location) {
			case 'project':
				return {
					filename: full_filename,
					url: `images/projects/${type}/${full_filename}`
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
	public static async downloadImageAsMulterFile(
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
