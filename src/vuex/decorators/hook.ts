import {Action, ActionDescriptor} from './action'
import {hookMetadataKey} from './constants'

const Created = (target, key, descriptor: ActionDescriptor) => {
  Action(target, key, descriptor)
  Reflect.defineMetadata(hookMetadataKey.created, {}, target, key)
}

const QueryChanged = (target, key, descriptor: ActionDescriptor) => {
  Action(target, key, descriptor)
  Reflect.defineMetadata(hookMetadataKey.queryChanged, {}, target, key)
}

export const Hook = {
  Created,
  QueryChanged
}
