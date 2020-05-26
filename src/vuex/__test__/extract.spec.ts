import {Action, Store, Mutation, Hook, createSubModule} from '../index'
import { extractClassToVuex } from '../extract'

@Store
class TestSubModule {
  state = 1

  get getMyState() { return this.state }
}

@Store
export class PageModule {
  test = createSubModule(TestSubModule)
  data = []

  get getMyData() {
    return this.data
  }

  @Mutation setData() {}

  @Action async loadSomeData() {}

  @Hook.Created async created() {}
  @Hook.QueryChanged async onQueryUpdated() {}
}

describe('Class must be transform to vuex format', () => {
  test('State', () => {
    const vuexModule = extractClassToVuex(PageModule)

    expect(vuexModule.state()).toEqual({data: []})
  })

  test('Getters', () => {
    const vuexModule = extractClassToVuex(PageModule)

    expect(Object.keys(vuexModule.getters)).toEqual(['getMyData'])
  })

  test('Mutations', () => {
    const vuexModule = extractClassToVuex(PageModule)

    expect(Object.keys(vuexModule.mutations)).toEqual(['setData'])
  })

  test('Actions', () => {
    const vuexModule = extractClassToVuex(PageModule)

    expect(Object.keys(vuexModule.actions)).toEqual(['loadSomeData', 'created', 'onQueryUpdated'])
  })

  test('Modules', () => {
    const vuexModule = extractClassToVuex(PageModule)

    expect(vuexModule.modules.test.state()).toEqual({state: 1})
    expect(Object.keys(vuexModule.modules.test.getters)).toEqual(['getMyState'])
  })
})
