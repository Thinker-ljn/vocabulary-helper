<script setup lang="ts">
// import { spinProps } from 'ant-design-vue/es/spin/Spin'

import * as antd from 'ant-design-vue'

const props = defineProps({
  ...antd.Spin.props,
  hFull: {
    type: Boolean,
    default: true,
  },
})
const tip = computed(() => props.tip || '加载中...')
const size = computed(() => props.size || 'large')
</script>
<template>
  <a-spin v-bind="props" :tip="tip" :size="size" :wrapper-class-name="hFull ? 'tm-spin-h-full' : ''">
    <slot />
  </a-spin>
</template>

<style scoped>
.ant-spin-nested-loading,
:deep(.ant-spin-container) {
  width: 100%;
}

.tm-spin-h-full.ant-spin-nested-loading,
:deep(.ant-spin-container) {
  height: 100%;
}
:deep(.ant-spin.ant-spin-spinning) {
  max-height: initial;
}
</style>
