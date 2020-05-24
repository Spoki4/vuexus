import 'reflect-metadata'

const metadataSubModuleKey = '__submodule__'

export const isSubModule = (target, key) => {
  return Reflect.hasMetadata(metadataSubModuleKey, target, key)
}

export const getSubModuleClass = (target, key) => {
  return Reflect.getMetadata(metadataSubModuleKey, target, key)
}

export const SubModule = (target, key) => {
  const Class = Reflect.getMetadata('design:type', target, key)
  Reflect.defineMetadata(metadataSubModuleKey, Class, target, key)

  const instance = new Class()

  Object.defineProperty(target, key, {
    get() {
      return instance
    }
  })
}
