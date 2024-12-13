import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { NestMinioModule } from 'nestjs-minio'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CategoriesModule } from './categories/categories.module'
import { GalleryModule } from './gallery/gallery.module'
import { GstorageModule } from './gstorage/gstorage.module'
import { GstorageService } from './gstorage/gstorage.service'
import { ProjectsModule } from './projects/projects.module'
import { RolesModule } from './roles/roles.module'
import { SessionsModule } from './sessions/sessions.module'
import { TagsModule } from './tags/tags.module'
import { UploadsModule } from './uploads/uploads.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		NestMinioModule.register({
			isGlobal: true,
			endPoint: '141.147.110.55',
			port: 9000,
			useSSL: false,
			accessKey: 'Q9Cdah6uzgbsS7C2WpH7',
			secretKey: '7qLaFOlowh8niSvoh2w38vdDHTReTSWdWrS6Pgqw'
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		AuthModule,
		UserModule,
		GstorageModule,
		UploadsModule,
		RolesModule,
		UploadsModule,
		GstorageModule,
		SessionsModule,
		ProjectsModule,
		TagsModule,
		CategoriesModule,
		GalleryModule
	],
	controllers: [AppController],
	providers: [AppService, GstorageService]
})
export class AppModule {}
