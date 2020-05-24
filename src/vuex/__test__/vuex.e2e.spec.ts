require('jsdom-global')()
import {createLocalVue, mount} from '@vue/test-utils'
import Vue from 'vue'
import Vuex, {Store as VuexStore} from 'vuex'
import {Getter, Store} from '../decorators'
import {Plugin} from '../plugin'
import '../vue'

@Store
class MainStore {
  a = 1

  @Getter
  getA() { return this.a }
}

const SimpleComponent = Vue.extend({
  template: '<div>{{ a }} {{ getterA }}</div>',
  stores: {
    mainStore: MainStore
  },
  computed: {
    getterA() {
      return this.$store.getters['MainStore/getA']
    },
    a() {
      return this.$store.state.MainStore.a
    },
    /*proxyStateA() {
      return this.mainStore.a
    },
    proxyGetterA() {
      return this.mainStore.getA
    }*/
  }
})

describe('Vuex e2e', () => {
  let localVue: typeof Vue
  let store: VuexStore<any>

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new VuexStore({})
    localVue.use(Plugin)
  })

  it('should be return 1 from computed', async () => {
    const wrapper = await mount(SimpleComponent, {
      localVue,
      store
    })
    expect(wrapper.html()).toMatchInlineSnapshot('"<div>1 1</div>"')
  })

  it('should be unregistered after component destroyed', async () => {
    const wrapper = await mount(SimpleComponent, {
      localVue,
      store
    })
    wrapper.destroy()
    expect(store.state.MainStore).toBeUndefined()
  })
})
