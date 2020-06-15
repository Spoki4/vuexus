export type MutationDescriptor =  TypedPropertyDescriptor<(payload?: any) => any>

export const isMutation = (target, key) => {
  return (target.__mutations__ || []).includes(key)
}

export const Mutation = (target, key, _descriptor: MutationDescriptor) => {
  target.__mutations__ = [...(target.__mutations__ || []), key]
}
