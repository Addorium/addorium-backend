import { Storage } from '@google-cloud/storage'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GstorageService {
	private storage: Storage
	private bucketName: string

	constructor() {
		this.storage = new Storage({
			keyFilename: 'service_account.json'
		})
		this.bucketName = 'bprint'
	}

	async uploadFile(filename: string, file: Buffer) {
		const bucket = this.storage.bucket(this.bucketName)
		const fileUpload = bucket.file(filename)

		await fileUpload.save(file, {
			metadata: {
				contentType: 'auto-detect',
				cacheControl: 'no-cache'
			}
		})
		return `https://storage.googleapis.com/${this.bucketName}/${filename}`
	}

	async deleteFile(filename: string) {
		const bucket = this.storage.bucket(this.bucketName)
		await bucket.file(filename).delete()
	}

	async getFile(filename: string): Promise<Buffer> {
		const bucket = this.storage.bucket(this.bucketName)
		const file = bucket.file(filename)
		const [content] = await file.download()
		return content
	}
}
