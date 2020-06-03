import {Module, ModuleTree, Store as VuexStore} from 'vuex'
import {extractClassToVuex} from './extract'
import {getUnitPath} from './utils/unit-path'

type CreateProxyOptions = {
  Class: { new() },
  store: VuexStore<any>,
  modulePrefix?: string
}

export const createProxy = (opts: CreateProxyOptions) => {
  const vuexModule: Module<any, any> = extractClassToVuex(opts.Class)

  return createProxyFromVuexModule(vuexModule, {
    modulePrefix: opts.modulePrefix || opts.Class.name,
    store: opts.store
  })
}

type CreateProxyFromVuexModuleOptions = {
  store: VuexStore<any>,
  modulePrefix: string
}

export const createProxyFromVuexModule = (module: Module<any, any>, opts: CreateProxyFromVuexModuleOptions) => {
  const proxyObj = {}

  createStateProxy(opts, proxyObj, Object.keys(module.state()))
  module.getters && createGettersProxy(opts, proxyObj, Object.keys(module.getters))
  module.mutations && createMutationsProxy(opts, proxyObj, Object.keys(module.mutations))
  module.actions && createActionsProxy(opts, proxyObj, Object.keys(module.actions))
  module.modules && createSubModulesProxy(opts, proxyObj, module.modules)

  return proxyObj
}

const createStateProxy = (opts: CreateProxyFromVuexModuleOptions, proxyObj, stateKeys: string[]) => {
  // from: ClassName.a
  // to: store.state.ClassName.a


  stateKeys.forEach(field => {
    const path = getUnitPath(opts.modulePrefix).split('/')
    Object.defineProperty(proxyObj, field, {
      get() {
        return path.reduce((obj, key) => obj[key], opts.store.state)[field]
      }
    })
  })
}

const createGettersProxy = (opts: CreateProxyFromVuexModuleOptions, proxyObj, getters: string[]) => {
  // from: ClassName.getterName
  // to: store.getters[`ClassName/getterName`]

  getters.forEach(key => {
    Object.defineProperty(proxyObj, key, {
      get() {
        return opts.store.getters[getUnitPath(opts.modulePrefix, key)]
      }
    })
  })
}

const createMutationsProxy = (opts: CreateProxyFromVuexModuleOptions, proxyObj, mutations: string[]) => {
  // from: ClassName.mutationName(payload)
  // to: store.commit(`ClassName/mutationName`, payload, { root: true })
  mutations.forEach(key => {
    proxyObj[key] = (payload: any) => opts.store.commit(getUnitPath(opts.modulePrefix, key), payload, { root: true })
  })
}

const createActionsProxy = (opts: CreateProxyFromVuexModuleOptions, proxyObj, actions: string[]) => {
  // from: ClassName.actionName(payload)
  // to: store.dispatch(`ClassName/actionName`, payload, { root: true })

  actions.forEach(key => {
    proxyObj[key] = (payload: any) => opts.store.dispatch(getUnitPath(opts.modulePrefix, key), payload, { root: true })
  })
}

const createSubModulesProxy = (opts: CreateProxyFromVuexModuleOptions, proxyObj, modules: ModuleTree<any>) => {
  const modulesKeys = Object.keys(modules)
  modulesKeys.forEach(key => {
    const subModuleProxy = createProxyFromVuexModule(modules[key], {
      store: opts.store,
      modulePrefix: getUnitPath(opts.modulePrefix, key)
    })

    Object.defineProperty(proxyObj, key, {
      get() {
        return subModuleProxy
      }
    })
  })
}


