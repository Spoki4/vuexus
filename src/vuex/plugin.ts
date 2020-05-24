import Vue from 'vue'
import {extractedModuleCacheKey} from './decorators'
import { ObjectClass } from './vue'

const getClasses = (stores?: ObjectClass) => {
  return Object.values(stores || {})
}

const VuexusGlobalMixin = Vue.extend({
  beforeCreate() {
    const stores = getClasses(this.$options.stores)

    stores.forEach(StoreClass => {
      const isStore = Reflect.hasMetadata(extractedModuleCacheKey, StoreClass)
      if (!isStore) {
        return console.warn(`${StoreClass.name} not a Module, maybe you forgot @Store decorator`)
      }
      const vuexModule = Reflect.getMetadata(extractedModuleCacheKey, StoreClass)
      this.$store.registerModule(StoreClass.name, vuexModule)
    })
  },
  created() {
    const stores = getClasses(this.$options.stores)
    stores.forEach(StoreClass => {
      // Call Hook.Created handler
    })
  },
  watch: {
    '$router.query': {
      handler() {
        const stores = getClasses(this.$options.stores)
        stores.forEach(StoreClass => {
          // Call Hook.QueryChanged handler
        })
      }
    }
  },
  destroyed() {
    const stores = getClasses(this.$options.stores)

    stores.forEach(StoreClass => {
      this.$store.unregisterModule(StoreClass.name)
    })
  }
})

export const Plugin: Vue.PluginObject<void> = {
  install(Vue) {
    Vue.mixin(VuexusGlobalMixin)
  }
}
