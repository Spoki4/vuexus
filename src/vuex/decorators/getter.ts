import 'reflect-metadata'

export const getterMetadataKey = '__getter__'

export const isGetter = (target, key) => {
  return Reflect.hasMetadata(getterMetadataKey, target, key)
}

export const Getter = (target, key: string, descriptor) => {
  Reflect.defineMetadata(getterMetadataKey, {}, target, key)
}
