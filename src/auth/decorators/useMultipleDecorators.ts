import { applyDecorators, UseGuards } from '@nestjs/common'

export function UseMultipleGuards(...guards: any[]) {
	return applyDecorators(UseGuards(...guards))
}
