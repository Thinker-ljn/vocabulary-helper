<script setup lang="ts">
import WordVue from '~/domain/word/index.vue'
defineProps<{
  pos: { x: number; y: number }
  word: string
  last: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const updated = ref(false)
const popover = ref()
const update = () => {
  updated.value = true
  popover.value.syncPosition()
}

const verba = ref()
</script>
<template>
  <n-popover ref="popover" placement="right" :show="!!word" :x="pos.x" :y="pos.y" trigger="manual">
    <template #header>
      <n-h1 style="margin: 0" prefix="bar">
        <n-text type="primary">
          {{ word }}
        </n-text>
        <div class="inline-block ml-2 align-middle cursor-pointer" i-radix-icons:speaker-loud @click="verba.play()" />
      </n-h1>
      <div v-if="last && updated" i-ion-close-round class="absolute right-2 top-2 text-xl cursor-pointer" @click="emits('close')" />
    </template>
    <word-vue ref="verba" :word="word" @update="update" />
  </n-popover>
</template>
