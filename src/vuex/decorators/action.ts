import 'reflect-metadata'
export type ActionDescriptor =  TypedPropertyDescriptor<(payload?:any) => Promise<any>>

export const actionMetadataKey = '__action__'

export const isAction = (target, key) => {
  return Reflect.hasMetadata(actionMetadataKey, target, key)
}

export const Action = (target, key, descriptor: ActionDescriptor) => {
  Reflect.defineMetadata(actionMetadataKey, {}, target, key)
}
