<script setup lang="ts">
import { getHTML } from '~/utils/axios'

const props = defineProps<{
  word: string
}>()

const imgSrcs = reactive({
  word: '',
  list: [] as string[],
})

const findSrc = (html: string) => {
  const list = [...html.matchAll(/_setImgSrc\('\d+','([^)]+)'\)/g)].map(a => a[1].replace(/\\/g, ''))
  return list
}

const search = () => {
  if (imgSrcs.word === props.word)
    return
  getHTML(`https://www.google.com/search?q=${props.word}&tbm=isch`)
    .then((html: string) => {
      imgSrcs.list = findSrc(html)
      imgSrcs.word = props.word
    })
}
</script>

<template>
  <n-popover trigger="click" :width="1000">
    <template #trigger>
      <div i-carbon:logo-google class="inline-block ml-2 align-middle cursor-pointer" @click="search()" />
    </template>
    <div style="height: 500px; overflow: auto;">
      <n-space>
        <n-image
          v-for="(src, index) in imgSrcs.list"
          :key="index"
          :src="src"
        />
      </n-space>
    </div>
  </n-popover>
</template>
