import {Action, ActionDescriptor} from './action'

const Created = (target, key, descriptor: ActionDescriptor) => {
  Action(target, key, descriptor)
  target.__created__ = [...(target.__created__ || []), key]
}

const QueryChanged = (target, key, descriptor: ActionDescriptor) => {
  Action(target, key, descriptor)
  target.__queryChanged__ = [...(target.__queryChanged__ || []), key]
}

export const Hook = {
  Created,
  QueryChanged
}
