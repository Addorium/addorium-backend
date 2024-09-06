import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { BlueprintsModule } from './blueprints/blueprints.module'
import { GstorageModule } from './gstorage/gstorage.module'
import { GstorageService } from './gstorage/gstorage.service'
import { RolesModule } from './roles/roles.module'
import { UploadsModule } from './uploads/uploads.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		GstorageModule,
		UploadsModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			context: ({ req, res }) => ({ req, res }),
			playground: {
				settings: {
					'request.credentials': 'include'
				}
			}
		}),
		RolesModule,
		BlueprintsModule,
		UploadsModule,
		GstorageModule
	],
	controllers: [AppController],
	providers: [AppService, GstorageService]
})
export class AppModule {}
