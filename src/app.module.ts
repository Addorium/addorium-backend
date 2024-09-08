import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { BlueprintsModule } from './blueprints/blueprints.module'
import { GstorageModule } from './gstorage/gstorage.module'
import { GstorageService } from './gstorage/gstorage.service'
import { RolesModule } from './roles/roles.module'
import { UploadsModule } from './uploads/uploads.module'
import { UserModule } from './user/user.module'
import { SessionsModule } from './sessions/sessions.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		GstorageModule,
		UploadsModule,
		RolesModule,
		BlueprintsModule,
		UploadsModule,
		GstorageModule,
		SessionsModule
	],
	controllers: [AppController],
	providers: [AppService, GstorageService]
})
export class AppModule {}
