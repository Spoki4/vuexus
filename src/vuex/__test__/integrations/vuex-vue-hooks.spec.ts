require('jsdom-global')()
import {createLocalVue, mount} from '@vue/test-utils'
import Vue from 'vue'
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
})
