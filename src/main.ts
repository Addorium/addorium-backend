import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: [process.env.FRONTEND_URL],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	app.enableVersioning({
		prefix: 'v',
		defaultVersion: '1',
		type: VersioningType.URI
	})

	const config = new DocumentBuilder()
		.setTitle('Addorium API')
		.setDescription('The Addorium API')
		.setVersion('1.0')
		.addTag('Addorium')
		.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
		.addCookieAuth('refreshToken')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document, {
		jsonDocumentUrl: 'swagger/json'
	})

	await app.listen(4200)
}
bootstrap()
