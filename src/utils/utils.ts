export function parseHtml(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc
}

export function asyncParseHtml(html: Promise<string>) {
  return html.then(parseHtml)
}

export function filterEmpty<T>(val: (T | undefined)[]) {
  return val.filter((x): x is T => x !== undefined)
}

export const tuple = <T extends string>(...args: T[]) => args
