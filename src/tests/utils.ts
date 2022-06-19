import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

export function useSetup<V>(setup: () => V) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    },
  })

  return mount(Comp)
}
