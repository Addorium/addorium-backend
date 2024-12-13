import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GstorageService } from './gstorage.service'

@Module({
	exports: [GstorageService],
	providers: [GstorageService, ConfigService]
})
export class GstorageModule {}
