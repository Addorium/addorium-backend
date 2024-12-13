import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MINIO_CONNECTION } from 'nestjs-minio'

@Injectable()
export class GstorageService {
	private readonly bucketName: string

	constructor(
		@Inject(MINIO_CONNECTION) private readonly minioClient,
		private readonly configService: ConfigService
	) {
		this.bucketName = this.configService.get<string>('MINIO_BUCKET')
	}

	async uploadFile(filename: string, file: Buffer) {
		await this.minioClient.putObject(this.bucketName, filename, file)
		return `http://${this.configService.get<string>('MINIO_ENDPOINT')}:${this.configService.get<string>('MINIO_PORT')}/${this.bucketName}/${filename}`
	}

	async deleteFile(filename: string) {
		await this.minioClient.removeObject(this.bucketName, filename)
	}

	async getFile(filename: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			this.minioClient.getObject(
				this.bucketName,
				filename,
				(err, dataStream) => {
					if (err) {
						return reject(err)
					}
					const chunks: Buffer[] = []
					dataStream.on('data', chunk => {
						chunks.push(chunk)
					})
					dataStream.on('end', () => {
						resolve(Buffer.concat(chunks))
					})
					dataStream.on('error', reject)
				}
			)
		})
	}
}
