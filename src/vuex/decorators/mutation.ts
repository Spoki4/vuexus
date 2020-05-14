export type MutationDescriptor =  TypedPropertyDescriptor<(payload?: any) => any>

export const mutationMetadataKey = "__mutation__"

export const isMutation = (target, key) => {
  return Reflect.hasMetadata(mutationMetadataKey, target, key)
}

export const Mutation = (target, key, descriptor: MutationDescriptor) => {
  Reflect.defineMetadata(mutationMetadataKey, {}, target, key)
}
