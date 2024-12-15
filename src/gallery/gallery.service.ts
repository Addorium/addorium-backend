import { GstorageService } from '@core/gstorage/gstorage.service'
import { PrismaService } from '@core/prisma.service'
import { Project } from '@core/projects/entities/projects.entity'
import { ProjectsService } from '@core/projects/projects.service'
import { UploadsService } from '@core/uploads/uploads.service'
import { HttpException, Injectable } from '@nestjs/common'
import { UpdateImageDto } from './dto/update-image.input'
import { UploadImageDto } from './dto/upload-image.input'

@Injectable()
export class GalleryService {
	constructor(
		private gstorage: GstorageService,
		private prisma: PrismaService,
		private projectsService: ProjectsService
	) {}

	async uploadImageToGallery(
		file: Express.Multer.File,
		uploadGalleryImageDto: UploadImageDto
	) {
		const project = await this.projectsService.findOneById(
			+uploadGalleryImageDto.projectId
		)
		if (!project) {
			throw new HttpException('Project not found', 404)
		}
		const { filename } = await this.uploadImage(file, project)
		const galleryImage = await this.prisma.projectImage.create({
			data: {
				title: uploadGalleryImageDto.title,
				description: uploadGalleryImageDto.description,
				url: filename,
				projectId: project.id
			}
		})
		return galleryImage
	}

	async deleteImageFromGallery(imageId: number) {
		const image = await this.prisma.projectImage.findUnique({
			where: { id: +imageId }
		})
		if (!image) {
			throw new HttpException('Image not found', 404)
		}
		const deletedImage = await this.prisma.projectImage.delete({
			where: { id: +imageId }
		})

		UploadsService.getProjectGalleryImageName(
			deletedImage.projectId.toString(),
			deletedImage.url
		)

		return deletedImage
	}
	async getById(id: number) {
		return await this.prisma.projectImage.findUnique({
			where: { id: +id },
			include: {
				project: {
					select: { id: true }
				}
			}
		})
	}
	async updateImageInGallery(id: number, updateImageDto: UpdateImageDto) {
		const image = await this.prisma.projectImage.findUnique({
			where: { id: +id }
		})
		if (!image) {
			throw new HttpException('Image not found', 404)
		}

		if (updateImageDto.bannerOf) {
			// Найти текущее изображение, которое является баннером для данного проекта
			const currentBanner = await this.prisma.projectImage.findFirst({
				where: {
					bannerOf: { id: updateImageDto.bannerOf }
				}
			})

			// Очистить поле bannerOf у текущего изображения, если оно существует
			if (currentBanner) {
				await this.prisma.projectImage.update({
					where: { id: currentBanner.id },
					data: { bannerOf: { disconnect: true } }
				})
			}
		}

		// Обновляем изображение
		const updatedImage = await this.prisma.projectImage.update({
			where: { id },
			data: {
				title: updateImageDto.title,
				description: updateImageDto.description,
				bannerOf: updateImageDto.bannerOf
					? { connect: { id: updateImageDto.bannerOf } }
					: undefined
			}
		})
		return updatedImage
	}

	private async uploadImage(file: Express.Multer.File, project: Project) {
		const webpBuffer = await UploadsService.convertToWebP(file.buffer)
		const { filename, url } = UploadsService.getProjectGalleryImageName(
			project.id.toString()
		)
		const uploadet_file = await this.gstorage.uploadFile(url, webpBuffer)
		return { filename, url, uploadet_file }
	}
}
