export const Plugin = {
  install(Vue, options) {
    Vue.mixin({
      beforeCreate() {
        console.log('before-create')
      },
      destroyed() {
        console.log('destoryed')
      }
    })
  }
}
