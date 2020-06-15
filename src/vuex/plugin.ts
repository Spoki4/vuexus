import Vue from 'vue'
import {extractClassToVuex} from './extract'
import {createProxy} from './proxy'
import { ObjectClass } from './vue'

const getClasses = (stores?: ObjectClass) => {
  return Object.entries(stores || {})
}

const VuexusGlobalMixin = Vue.extend({
  beforeCreate() {
    const stores = getClasses(this.$options.stores)

    stores.forEach(([key, StoreClass]) => {
      const vuexModule = extractClassToVuex(StoreClass)
      this.$store.registerModule(StoreClass.name, vuexModule)
      this[key] = createProxy({Class: StoreClass, store: this.$store})
    })
  },
  created() {
    const stores = getClasses(this.$options.stores)
    stores.forEach(([key, StoreClass]) => {
      (StoreClass.prototype.__created__ || []).forEach((actionKey) => this[key][actionKey]())
    })
  },
  watch: {
    '$router.query': {
      handler() {
        const stores = getClasses(this.$options.stores)
        stores.forEach(([key, StoreClass]) => {
          (StoreClass.prototype.__queryChanged__ || []).forEach((actionKey) => this[key][actionKey]())
        })
      }
    }
  },
  destroyed() {
    this.$nextTick(() => {
      const stores = getClasses(this.$options.stores)

      stores.forEach(([key, StoreClass]) => {
        this.$store.unregisterModule(StoreClass.name)
      })
    })
  }
})

export const Plugin: Vue.PluginObject<void> = {
  install(Vue) {
    Vue.mixin(VuexusGlobalMixin)
  }
}
