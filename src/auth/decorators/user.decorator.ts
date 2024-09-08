import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
	(data: keyof User, context: ExecutionContext) => {
		const ctx = context.switchToHttp()
		const request = ctx.getRequest()
		const user = request.user

		return data ? user[data] : user
	}
)
