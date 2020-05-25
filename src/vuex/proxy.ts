import {Module, Store as VuexStore} from 'vuex'
import {extractedModuleMetadataKey} from './decorators'
import {gettersNamesMetadataKey} from './decorators/constants'

type CreateProxyOptions = {
  Class: { new() },
  store: VuexStore<any>
}

export const createProxy = (opts: CreateProxyOptions) => {
  const vuexModule: Module<any, any> = Reflect.getMetadata(extractedModuleMetadataKey, opts.Class)

  const proxyObj = {}

  createStateProxy(opts, proxyObj, vuexModule.state)
  createGetterProxy(opts, proxyObj)

  return proxyObj
}

const createStateProxy = (opts: CreateProxyOptions, proxyObj, state: () => any) => {
  // ClassName.a
  // store.state.ClassName.a

  const stateObj = state()

  for (const field in stateObj) {
    Object.defineProperty(proxyObj, field, {
      get() {
        return opts.store.state[opts.Class.name][field]
      }
    })
  }
}

const createGetterProxy = (opts: CreateProxyOptions, proxyObj) => {
  // ClassName.a
  // store.getters[`ClassName/getterName`]

  const getters = Reflect.getMetadata(gettersNamesMetadataKey, opts.Class) || []

  getters.forEach(key => {
    Object.defineProperty(proxyObj, key, {
      get() {
        return opts.store.getters[`${opts.Class.name}/${key}`]
      }
    })
  })
}
