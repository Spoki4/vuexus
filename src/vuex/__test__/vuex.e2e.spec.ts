require('jsdom-global')()
import {createLocalVue, mount} from '@vue/test-utils'
import Vue from 'vue'
import Vuex, {Store as VuexStore} from 'vuex'
import {clearStoreCache, Getter, Mutation, Store} from '../decorators'
import {Plugin} from '../plugin'
import '../vue'

@Store
class MainStore {
  a = 1
  deep = {
    b: 'asd'
  }

  @Getter getA() { return this.a + 1 }

  @Mutation setA(a: number) {
    this.a = a
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
  })

  it('should be print warning when try to use class without decorator', async () => {
    class A {}
    const SimpleComponent = Vue.extend({
      template: '<div></div>',
      stores: {
        mainStore: A
      }
    })

    jest.spyOn(global.console, 'warn')

    await mount(SimpleComponent, {
      localVue,
      store
    })

    expect(global.console.warn).toBeCalled()
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
