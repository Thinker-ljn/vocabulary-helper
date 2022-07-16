<script setup lang="ts">
import type { Ref } from 'vue'
import type { Word } from './type'
import { useSearch } from './use-search'

const props = defineProps<{
  word: string
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const { word } = toRefs(props)
const verba: Ref<Word | null> = ref(null)
const search = useSearch()

const play = () => {
  if (verba.value?.audio) {
    const url = `https://audio.vocab.com/1.0/us/${verba.value?.audio}.mp3`
    new Audio(url).play()
  }
}

watch(word, () => {
  search(word.value)
    .then((result) => {
      verba.value = result
      nextTick(() => emits('update'))
      play()
    })
}, { immediate: true })

defineExpose({ play })
</script>
<template>
  <div class="max-w-120 max-h-130 overflow-auto">
    <template v-if="verba">
      <p>{{ verba.short }}</p>
      <p>{{ verba.long }}</p>
      <div v-for="def in verba.definitions" :key="def.definition" class="border my-2 p-2">
        <div class="flex">
          <div class="min-w-20 mr-2 text-right">
            <n-tag size="small" round>
              {{ def.classes }}
            </n-tag>
          </div>
          <div>
            <span>{{ def.definition }}</span>
            <p v-for="example in def.examples" :key="example">
              {{ example }}
            </p>
          </div>
        </div>
        <div v-for="ext in def.more" :key="ext.detail" class="flex">
          <div class="min-w-20 mr-2 text-right">
            {{ ext.detail }}
          </div>
          <div class="mb-1">
            <div v-for="dd in ext.dds" :key="dd.definition">
              <n-space size="small">
                <n-tag v-for="w in dd.words" :key="w" size="small">
                  {{ w }}
                </n-tag>
              </n-space>
              <div>{{ dd.definition }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="verba.family.length">
        <n-h3>
          <n-text>单词家族</n-text>
        </n-h3>
        <n-space>
          <n-tooltip v-for="member in verba.family" :key="member.word">
            <template #trigger>
              <n-tag>{{ member.word }}({{ member.pages }})</n-tag>
            </template>
            {{ member.tips }}
          </n-tooltip>
        </n-space>
      </div>
    </template>
  </div>
</template>
