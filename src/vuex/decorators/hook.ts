import {Action, ActionDescriptor} from './action'

const hookMetadataKey = {
  created: '__hook:created__',
  queryChanged: '__hook:queryChanged__'
}

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
