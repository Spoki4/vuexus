require('jsdom-global')()
import {createLocalVue, mount, shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex, {Store as VuexStore} from 'vuex'
import {Hook, Mutation, Store} from '../../decorators'
import {Plugin} from '../../plugin'
import '../../vue'

@Store
class MainStore {
  data = 1

  @Mutation setData(data: number) {
    this.data = data
  }

  @Hook.Created
  async created() {
    this.setData(2)
  }

  @Hook.QueryChanged
  async queryChanged({ query }) {
    this.setData(query.data)
  }
}

describe('Vuexus hooks', () => {
  let localVue: typeof Vue
  let store: VuexStore<any>

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new VuexStore({})
    localVue.use(Plugin)
  })

  it('should be run created hook', async () => {
    const SimpleComponent = Vue.extend({
      template: '<div>{{ mainStore.data }}</div>',
      stores: {
        mainStore: MainStore
      }
    })

    const wrapper = await mount(SimpleComponent, {
      localVue,
      store
    })
    expect(wrapper.html()).toMatchInlineSnapshot('"<div>2</div>"')
  })

  it('should be run query changed hook', async () => {
    const MainComponent = Vue.extend({
      template: '<div>{{ mainStore.data }}</div>',
      stores: {
        mainStore: MainStore
      }
    })

    const router = new VueRouter({
      routes: [{ name: 'main', component: MainComponent, path: '/main' }]
    })

    localVue.use(VueRouter)

    const wrapper = shallowMount(MainComponent, {
      localVue,
      store,
      router
    })
    await router.push({ query: {data: '10'} })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchInlineSnapshot('"<div>10</div>"')
  })
})
