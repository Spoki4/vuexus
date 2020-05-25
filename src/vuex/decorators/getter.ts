import 'reflect-metadata'
import {getterMetadataKey, gettersNamesMetadataKey} from './constants'
import {addArrayKeyMetadata} from './utils'

export const isGetter = (target, key) => {
  return Reflect.hasMetadata(getterMetadataKey, target, key)
}

export const Getter = (target, key: string, _descriptor) => {
  Reflect.defineMetadata(getterMetadataKey, {}, target, key)
  addArrayKeyMetadata(gettersNamesMetadataKey, key, target)
}
