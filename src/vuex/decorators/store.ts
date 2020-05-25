import {extractClassToVuex} from '../extract'
import {extractedModuleMetadataKey, storeNameMetadataKey} from './constants'

export const Store = (target) => {
  const vuexModule = extractClassToVuex(target)
  Reflect.defineMetadata(extractedModuleMetadataKey, vuexModule, target)
  Reflect.defineMetadata(storeNameMetadataKey, target.name, target)
  return target
}


export const clearStoreCache = (cls) => {
  Reflect.deleteMetadata(extractedModuleMetadataKey, cls)
  Reflect.deleteMetadata(storeNameMetadataKey, cls)
  Store(cls)
}
