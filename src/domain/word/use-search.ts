import type { Definition, MoreDefinition, Word } from './type'
import { getHTMLDOM } from '~/utils/axios'
import { Q, text } from '~/utils/dom'

export function useSearch() {
  const moreDefContentParser = (el: Element): MoreDefinition => {
    const [detail, ...dds] = Array.from(el.children || [])
    return {
      detail: detail.textContent || '',
      dds: dds.map(e => ({
        words: Array.from(e.querySelectorAll('.word')).map(ee => text(ee.textContent)),
        definition: text(e.querySelector('.definition')?.textContent),
      })),
    }
  }

  const definitionParser = (el: Element): Definition => {
    const more = Array.from(el.querySelectorAll('.defContent .instances'))
    const examples = Array.from(el.querySelectorAll('.defContent .example')).map(el => text(el.textContent))
    const d = {
      classes: el.firstElementChild?.firstElementChild?.textContent || '',
      definition: text(el.firstElementChild?.lastChild?.textContent),
      examples,
      more: more.map(moreDefContentParser),
    }
    return d
  }

  function unescape(str: string) {
    const el = document.createElement('div')
    el.innerHTML = str
    return el.textContent || ''
  }
  function encounter({ word, freq, ffreq }: any) {
    const pages = ffreq ? (1 + parseInt(`${1 / (ffreq / 4e3)}`)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0
    const tips = ffreq
      ? ffreq === freq ? `你每大约浏览${pages}页就可能遇到这个单词${word}` : `你每大约浏览${pages}页就可能遇到这个单词${word}的变体`
      : `你基本上遇不到这个单词${word}`
    return {
      word,
      pages,
      tips,
    }
  }
  const parsefamilys = (el: Element | null) => {
    const [, data = ''] = el?.innerHTML.match(/<vcom:wordfamily.*?data="([^"]+)"/) || []

    return (JSON.parse(unescape(data)) || []).map((item: any) => encounter(item))
  }
  const search = (input: string): Promise<Word | null> => {
    return getHTMLDOM(`https://www.vocabulary.com/dictionary/${input}`)
      .then((dom) => {
        const d = Q(dom)
        const word = text(d.q('.word-area h1')?.firstChild?.textContent)
        const audio = d.q('.word-area h1 a.audio')?.getAttribute('data-audio') || ''
        const short = d.t('.word-area .short')
        const long = d.t('.word-area .long')
        const family = parsefamilys(d.q('.section.family'))
        const definitions = d.qa('.word-definitions ol li').map(definitionParser)

        const verba: Word = {
          text: word,
          short,
          long,
          family,
          definitions,
          audio,
        }

        return verba
      })
  }

  return search
}
