import {Action, Getter, Store, Mutation, Hook, SubModule} from '../index'
import { extractClassToVuex } from '../extract'

@Store
class TestSubModule {
  state = 1

  @Getter getMyState() { return this.state }
}

@Store
export class PageModule {
  data = []

  @SubModule test!: TestSubModule

  @Getter getMyData() {
    return this.data
  }

  @Mutation setData(data) { this.data = data }

  @Action async loadSomeData(data) {
    this.setData(data)
  }

  // Вызывается автоматически в соответствующем жизненом цикле
  @Hook.Created async created(options) {
    // options = {params: {}, query: {}, cookies: {}}
    this.loadSomeData([123, 321, 456])
  }

  // Вызывается автоматически при изменении query параметров
  @Hook.QueryChanged async onQueryUpdated(options) {
    // options = {params: {}, query: {}, cookies: {}}
  }
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
