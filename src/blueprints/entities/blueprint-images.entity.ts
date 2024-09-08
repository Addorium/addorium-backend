import { ApiProperty } from '@nestjs/swagger'
import { BlueprintsImages as PrismaBlueprintsImages } from '@prisma/client'
export class BlueprintImage implements PrismaBlueprintsImages {
	@ApiProperty({ description: 'Blueprint image id' })
	id: number

	@ApiProperty({ description: 'Blueprint image title' })
	title: string

	@ApiProperty({ description: 'Blueprint image description' })
	description: string

	@ApiProperty({ description: 'Blueprint image url' })
	url: string

	@ApiProperty({ description: 'Blueprint id' })
	blueprintId: number

	@ApiProperty({ description: 'Blueprint image creation date' })
	createdAt: Date

	@ApiProperty({ description: 'Blueprint image update date' })
	updatedAt: Date

	@ApiProperty({ description: 'Blueprint image deletion date' })
	deletedAt: Date
}
