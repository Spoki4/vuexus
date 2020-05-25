import 'reflect-metadata'
import {SubModuleMetadataKey} from './constants'

export const isSubModule = (target, key) => {
  return Reflect.hasMetadata(SubModuleMetadataKey, target, key)
}

export const getSubModuleClass = (target, key) => {
  return Reflect.getMetadata(SubModuleMetadataKey, target, key)
}

export const SubModule = (target, key) => {
  const Class = Reflect.getMetadata('design:type', target, key)
  Reflect.defineMetadata(SubModuleMetadataKey, Class, target, key)

  const instance = new Class()

  Object.defineProperty(target, key, {
    get() {
      return instance
    }
  })
}
