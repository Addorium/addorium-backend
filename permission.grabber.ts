/* eslint-disable prettier/prettier */
import * as fs from 'fs'
import * as path from 'path'

const SRC_DIR = path.join(__dirname, 'src')
const OUTPUT_FILE = path.join(__dirname, 'permissions.txt')

const permissionRegex =
	/\b(?:users|admin|app):[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*\b/g
const permissionsSet = new Set<string>()

// Функция для рекурсивного обхода файлов
const scanDirectory = (dir: string) => {
	const files = fs.readdirSync(dir)

	for (const file of files) {
		const fullPath = path.join(dir, file)
		const stat = fs.statSync(fullPath)

		if (stat.isDirectory()) {
			scanDirectory(fullPath) // Рекурсивный вызов для подпапок
		} else if (stat.isFile() && file.endsWith('.ts')) {
			const content = fs.readFileSync(fullPath, 'utf-8')
			const matches = content.match(permissionRegex)
			if (matches) {
				matches.forEach(perm => permissionsSet.add(perm))
			}
		}
	}
}

scanDirectory(SRC_DIR)

// Записываем в файл, сортируя значения
const sortedPermissions = Array.from(permissionsSet).sort()
fs.writeFileSync(OUTPUT_FILE, sortedPermissions.join('\n'), 'utf-8')

console.log(
	`Найдено ${sortedPermissions.length} уникальных разрешений. Записано в permissions.txt`
)
