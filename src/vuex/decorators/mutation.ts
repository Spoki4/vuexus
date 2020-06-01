import {mutationMetadataKey} from './constants'

export type MutationDescriptor =  TypedPropertyDescriptor<(payload?: any) => any>

export const isMutation = (target, key) => {
  return Reflect.hasMetadata(mutationMetadataKey, target, key)
}

export const Mutation = (target, key, _descriptor: MutationDescriptor) => {
  Reflect.defineMetadata(mutationMetadataKey, {}, target, key)
}
