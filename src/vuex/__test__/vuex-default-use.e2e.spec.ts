require('jsdom-global')()
import {createLocalVue, mount} from '@vue/test-utils'
import Vue from 'vue'
import Vuex, {Store as VuexStore} from 'vuex'
import {Action, clearStoreCache, Mutation, Store, createSubModule} from '../decorators'
import {Plugin} from '../plugin'
import '../vue'

const createTest = () => {
  @Store class FactorySubModule {
    data = 'submodule data'

    get getMyData() { return this.data }

    @Mutation setData(data: string) {
      this.data = data
    }

    @Action async action(data: string) {
      this.setData(data)
    }
  }
  return createSubModule(FactorySubModule)
}

@Store
class MainStore {
  a = 1
  deep = {
    b: 'asd'
  }

  subModule = createTest()

  get getA() { return this.a + 1 }

  @Mutation setA(a: number) {
    this.a = a
  }

  @Action async asyncSetATo22() {
    this.setA(22)
  }
}

describe('Vuex e2e', () => {
  let localVue: typeof Vue
  let store: VuexStore<any>

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new VuexStore({})
    localVue.use(Plugin)
  })

  afterEach(() => {
    clearStoreCache(MainStore)
  })

  describe('direct access', () => {
    it('should be return 1 from direct state access', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ $store.state.MainStore.a }}</div>',
        stores: {
          mainStore: MainStore
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })
      expect(wrapper.html()).toMatchInlineSnapshot('"<div>1</div>"')
    })

    it('should be return 2 from direct getter access', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ getterA }}</div>',
        stores: {
          mainStore: MainStore
        },
        computed: {
          getterA() {
            return this.$store.getters['MainStore/getA']
          }
        }
      })
      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })
      expect(wrapper.html()).toMatchInlineSnapshot('"<div>2</div>"')
    })

    it('should be a equals 2 after call mutation', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ getterA }}</div>',
        stores: {
          mainStore: MainStore
        },
        computed: {
          getterA() {
            return this.$store.getters['MainStore/getA']
          }
        },
        methods: {
          changeA() {
            this.$store.commit('MainStore/setA', 2)
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })

      wrapper.vm.changeA()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>3</div>"')
    })

    it('should be getter a equals 3 after call mutation', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ $store.state.MainStore.a }}</div>',
        stores: {
          mainStore: MainStore
        },
        methods: {
          changeA() {
            this.$store.commit('MainStore/setA', 2)
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })

      wrapper.vm.changeA()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>2</div>"')
    })

    it('should be getter submodule data', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ $store.state.MainStore.subModule.data }}</div>',
        stores: {
          mainStore: MainStore
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>submodule data</div>"')
    })

    it('should be get submodule data from store', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ $store.getters[`MainStore/subModule/getMyData`] }}</div>',
        stores: {
          mainStore: MainStore
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>submodule data</div>"')
    })

    it('should be get submodule data after call mutation', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ $store.getters[`MainStore/subModule/getMyData`] }}</div>',
        stores: {
          mainStore: MainStore
        },
        methods: {
          doSmth() {
            this.$store.commit('MainStore/subModule/setData', 'mutation')
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })
      wrapper.vm.doSmth()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>mutation</div>"')
    })

    it('should be get submodule data after call action', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ $store.getters["MainStore/subModule/getMyData"] }}</div>',
        stores: {
          mainStore: MainStore
        },
        methods: {
          doSmth() {
            this.$store.dispatch('MainStore/subModule/action', 'action')
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })
      wrapper.vm.doSmth()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>action</div>"')
    })
  })

  describe('proxied access', () => {
    it('should be return 1 from proxied state', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ mainStore.deep.b }}</div>',
        stores: {
          mainStore: MainStore
        }
      })
      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })
      expect(wrapper.html()).toMatchInlineSnapshot('"<div>asd</div>"')
    })

    it('should be return 1 from proxied state', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ mainStore.a }}</div>',
        stores: {
          mainStore: MainStore
        }
      })
      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })
      expect(wrapper.html()).toMatchInlineSnapshot('"<div>1</div>"')
    })

    it('should be a equals 3 after call mutation', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ mainStore.a }}</div>',
        stores: {
          mainStore: MainStore
        },
        methods: {
          changeA() {
            this.mainStore.setA(3)
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })

      wrapper.vm.changeA()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>3</div>"')
    })

    it('should be equals 3 after call action', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ mainStore.a }}</div>',
        stores: {
          mainStore: MainStore
        },
        methods: {
          changeA() {
            this.mainStore.asyncSetATo22()
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })

      wrapper.vm.changeA()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>22</div>"')
    })

    it('should be get deep', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ mainStore.deep.b }}</div>',
        stores: {
          mainStore: MainStore
        },
        methods: {
          changeA() {
            this.mainStore.asyncSetATo22()
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })

      wrapper.vm.changeA()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>asd</div>"')
    })

    it('should be submodule state getter', async () => {
      const SimpleComponent = Vue.extend({
        template: '<div>{{ data }}</div>',
        stores: {
          mainStore: MainStore
        },
        computed: {
          data() {
            return this.mainStore.subModule.getMyData
          }
        },
        methods: {
          updateSmth() {
            this.mainStore.subModule.action('updated')
          }
        }
      })

      const wrapper = await mount(SimpleComponent, {
        localVue,
        store
      })
      wrapper.vm.updateSmth()
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toMatchInlineSnapshot('"<div>updated</div>"')
    })
  })

  it('should be unregistered after component destroyed', async () => {
    const SimpleComponent = Vue.extend({
      template: '<div></div>',
      stores: {
        mainStore: MainStore
      }
    })
    const wrapper = await mount(SimpleComponent, {
      localVue,
      store
    })
    wrapper.destroy()
    await wrapper.vm.$nextTick()
    expect(store.state.MainStore).toBeUndefined()
  })
})
