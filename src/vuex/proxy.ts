import {Module, Store as VuexStore} from 'vuex'
import {extractedModuleMetadataKey} from './decorators'
import {gettersNamesMetadataKey, mutationsNamesMetadataKey} from './decorators/constants'

type CreateProxyOptions = {
  Class: { new() },
  store: VuexStore<any>
}

export const createProxy = (opts: CreateProxyOptions) => {
  const vuexModule: Module<any, any> = Reflect.getMetadata(extractedModuleMetadataKey, opts.Class)

  const proxyObj = {}

  createStateProxy(opts, proxyObj, vuexModule.state())
  createGetterProxy(opts, proxyObj)
  createMutationProxy(opts, proxyObj)

  return proxyObj
}

const createStateProxy = (opts: CreateProxyOptions, proxyObj, state: {}) => {
  // from: ClassName.a
  // to: store.state.ClassName.a

  for (const field in state) {
    Object.defineProperty(proxyObj, field, {
      get() {
        return opts.store.state[opts.Class.name][field]
      }
    })
  }
}

const createGetterProxy = (opts: CreateProxyOptions, proxyObj) => {
  // from: ClassName.getterName
  // to: store.getters[`ClassName/getterName`]

  const getters = Reflect.getMetadata(gettersNamesMetadataKey, opts.Class.prototype) || []

  getters.forEach(key => {
    Object.defineProperty(proxyObj, key, {
      get() {
        return opts.store.getters[`${opts.Class.name}/${key}`]
      }
    })
  })
}

const createMutationProxy = (opts: CreateProxyOptions, proxyObj) => {
  // from: ClassName.mutationName(payload)
  // to: store.commit(`ClassName/mutationName`, payload, { root: true })

  const mutations = Reflect.getMetadata(mutationsNamesMetadataKey, opts.Class.prototype) || []

  mutations.forEach(key => {
    proxyObj[key] = (payload: any) => opts.store.commit(`${opts.Class.name}/${key}`, payload, { root: true })
  })
}
