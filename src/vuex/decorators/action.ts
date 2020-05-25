import 'reflect-metadata'
import {actionMetadataKey} from './constants'

export type ActionDescriptor =  TypedPropertyDescriptor<(payload?:any) => Promise<any>>

export const isAction = (target, key) => {
  return Reflect.hasMetadata(actionMetadataKey, target, key)
}

export const Action = (target, key, _descriptor: ActionDescriptor) => {
  Reflect.defineMetadata(actionMetadataKey, {}, target, key)
}
