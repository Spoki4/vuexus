import {isAction, isMutation} from './decorators'
import {getSubModuleClass, isSubModule} from './submodule'
import {createProxy} from './proxy'
import {getUnitPath} from './utils/unit-path'

/**
 * Class to vuex module object
 */
export const extractClassToVuex = (Class, prefix?: string) => {
  const { state, subModules } = extractStateAndSubModules(Class)
  const { getters, mutations, actions } = extractMethods(Class, prefix)

  return {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    modules: subModules
  }
}

/**
 * Class to vuex module object
 */
const extractStateAndSubModules = (Class) => {
  const instance = new Class()
  const subModules: Record<string, any> = {}
  const state: Record<string, any> = {}

  for (const field of Object.getOwnPropertyNames(instance)) {
    if (isSubModule(instance[field])) {
      const subModuleClass = getSubModuleClass(instance[field])
      subModules[field] = extractClassToVuex(subModuleClass, getUnitPath(Class.name, field))
    } else {
      state[field] = instance[field]
    }
  }

  return {
    state: () => state,
    subModules
  }
}

const extractMethods = (Class, prefix?: string) => {
  const getters: Record<string, any> = {}
  const mutations: Record<string, any> = {}
  const actions: Record<string, any> = {}

  const cls = Class.prototype
  const propertyDescriptors = Object.getOwnPropertyDescriptors(cls)
  const gettersKeys: string[] = Object.keys(propertyDescriptors).filter(key => propertyDescriptors[key].get)

  for (const field of Object.getOwnPropertyNames(cls)) {
    if (gettersKeys.includes(field)) {
      getters[field] = state => propertyDescriptors[field].get!.call(state)
    } else if (isMutation(cls, field)) {
      mutations[field] = (state, payload) => cls[field].call(state, payload)
    } else if (isAction(cls, field)) {
      actions[field] = (ctx, payload) => {
        const localCtx = createProxy({
          Class,
          store: ctx,
          modulePrefix: prefix
        })
        return cls[field].call(localCtx, payload)
      }
    }
  }

  return {
    getters,
    mutations,
    actions
  }
}
