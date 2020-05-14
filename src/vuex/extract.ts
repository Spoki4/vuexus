import {getSubModuleClass, isAction, isGetter, isMutation, isSubModule} from './decorators'

/**
 * Class to vuex module object
 */
export const extractClassToVuex = (Class) => {
  const { state } = extractState(Class)
  const { getters, mutations, actions, subModules } = extractMethodsAndSubModules(Class)

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
const extractState = (Class) => {
  const instance = new Class()
  const state: Record<string, any> = {}

  for (const field of Object.getOwnPropertyNames(instance)) {
      state[field] = instance[field]
  }

  return {
    state: () => state
  }
}

const extractMethodsAndSubModules = (Class) => {
  const subModules: Record<string, any> = {}
  const getters: Record<string, any> = {}
  const mutations: Record<string, any> = {}
  const actions: Record<string, any> = {}

  const cls = Class.prototype

  for (const field of Object.getOwnPropertyNames(cls)) {
    if (isSubModule(cls, field)) {
      const subModuleClass = getSubModuleClass(cls, field)
      subModules[field] = extractClassToVuex(subModuleClass)
    } else if (isGetter(cls, field)) {
      getters[field] = (state, payload) => cls[field].call(state, payload)
    } else if (isMutation(cls, field)) {
      mutations[field] = (state, payload) => cls[field].call(state, payload)
    } else if (isAction(cls, field)) {
      actions[field] = (ctx, payload) => cls[field].call(ctx, payload)
    }
  }

  return {
    subModules,
    getters,
    mutations,
    actions
  }
}
