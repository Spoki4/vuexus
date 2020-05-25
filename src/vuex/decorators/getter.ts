import 'reflect-metadata'
import {getterMetadataKey, gettersNamesMetadataKey} from './constants'

export const isGetter = (target, key) => {
  return Reflect.hasMetadata(getterMetadataKey, target, key)
}

export const Getter = (target, key: string, _descriptor) => {
  Reflect.defineMetadata(getterMetadataKey, {}, target, key)

  let gettersName = Reflect.getMetadata(gettersNamesMetadataKey, target)

  if (!gettersName)
    gettersName = []

  gettersName.push(key)
  Reflect.defineMetadata(gettersNamesMetadataKey, gettersName, target)
}
