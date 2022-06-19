export function Q(dom: Document | Element) {
  const tool = {
    q(str: string) {
      return dom.querySelector(str)
    },
    qa(str: string) {
      return Array.from(dom.querySelectorAll(str))
    },
    t(str: string) {
      return tool.q(str)?.textContent || ''
    },
  }

  return tool
}

export function text(str?: string | null) {
  return (str || '').trim()
}
