<script setup lang="ts">
import type { ClickInfo } from './domain/click/text'
import { useClickText } from './domain/click/text'
import Popover from '~/domain/popover/index.vue'
const words = ref<ClickInfo[]>([])

const pop = () => {
  words.value.pop()
}

useClickText((text) => {
  if (!text)
    pop()
  else
    words.value.push(text)
})

</script>

<template>
  <div>
    <popover
      v-for="(word, index) in words" :key="word.id" :last="index === words.length - 1" :word="word.text" :pos="word.pos" @close="pop"
    />
  </div>
</template>
