export class ProjectImage {
	id: number
	title: string
	description: string
	url: string
	projectId: number
	bannerOf?: ProjectImage
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}
