import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_KEY = 'permissions'
export const Permission = (...permission: string[]) =>
	SetMetadata('permissions', permission)
