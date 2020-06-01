import {storeNameMetadataKey} from './constants'

export const Store = (target) => {
  Reflect.defineMetadata(storeNameMetadataKey, target.name, target)
  return target
}


export const clearStoreCache = (cls) => {
  Reflect.deleteMetadata(storeNameMetadataKey, cls)
  Store(cls)
}
