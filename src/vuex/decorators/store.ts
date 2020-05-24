import {extractClassToVuex} from '../extract'

export const extractedModuleCacheKey = '__extracted-module-cache__'

export const Store = (target) => {
  const vuexModule = extractClassToVuex(target)
  Reflect.defineMetadata(extractedModuleCacheKey, vuexModule, target)

  return target
}
