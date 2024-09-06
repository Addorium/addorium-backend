import { Module } from '@nestjs/common'
import { GstorageService } from './gstorage.service'

@Module({
	providers: [GstorageService],
	exports: [GstorageService]
})
export class GstorageModule {}
