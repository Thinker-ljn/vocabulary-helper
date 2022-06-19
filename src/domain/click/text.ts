export function getClickText() {
  const selection = window.getSelection()
  if (!selection)
    return ''
  const node = selection.anchorNode
  if (!node)
    return ''
  const range = selection.getRangeAt(0)
  // console.log(selection, node, range)
  const padding = () => /[^\w\-]/.test(range.toString())
  const leftEdge = () => range.startOffset === 0 || padding()
  const rightEdge = () => range.endOffset === (node as any).length || padding()
  while (!leftEdge())
    range.setStart(node, range.startOffset - 1)

  if (padding())
    range.setStart(node, range.startOffset + 1)

  while (!rightEdge())
    range.setEnd(node, range.endOffset + 1)

  if (padding())
    range.setEnd(node, range.endOffset - 1)

  const str = range.toString().trim()
  selection.removeAllRanges()
  return str
}

export interface ClickInfo {
  pos: {
    x: number
    y: number
  }
  text: string
  id: number
}
let id = 0
export function useClickText(callback: (str: ClickInfo | null) => void) {
  function onClick(e: MouseEvent) {
    if (!e.ctrlKey)
      return
    e.preventDefault()
    const text = getClickText()
    callback(text
      ? {
          id: id++,
          text,
          pos: {
            x: e.clientX,
            y: e.clientY,
          },
        }
      : null)
  }

  const close = (e: KeyboardEvent) => {
    if (e.key === 'Escape')
      callback(null)
  }
  onMounted(() => {
    document.addEventListener('click', onClick)
    document.addEventListener('keyup', close)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', onClick)
    document.removeEventListener('keyup', close)
  })
}
