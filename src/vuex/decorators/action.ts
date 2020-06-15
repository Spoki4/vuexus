export type ActionDescriptor =  TypedPropertyDescriptor<(payload?:any) => Promise<any>>

export const isAction = (target, key) => {
  return target.__actions__?.includes(key)
}

export const Action = (target, key, _descriptor: ActionDescriptor) => {
  target.__actions__ = [...(target.__actions__ || []), key]
}
