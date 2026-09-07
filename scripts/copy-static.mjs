import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const standalone = join(root, '.next', 'standalone')

const publicSource = join(root, 'public')
if (existsSync(publicSource)) {
  cpSync(publicSource, join(standalone, 'public'), { recursive: true })
}

const staticSource = join(root, '.next', 'static')
const staticDest = join(standalone, '.next', 'static')
if (existsSync(staticSource)) {
  mkdirSync(join(standalone, '.next'), { recursive: true })
  cpSync(staticSource, staticDest, { recursive: true })
}