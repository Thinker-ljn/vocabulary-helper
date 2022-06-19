import type { AxiosResponse } from 'axios'
import axios from 'axios'
import gmxhrAdapter from 'axios-userscript-adapter'
import { asyncParseHtml } from './utils'

export const service = axios.create({
  adapter: gmxhrAdapter as any,
})

service.interceptors.response.use((res: AxiosResponse) => {
  // console.log(res.config.url, res.status)
  return res.data
})

export async function getHTMLDOM(url?: string): Promise<Document> {
  return !url || location.href === url
    ? document
    : asyncParseHtml(getHTML(url))
}

export function getHTML(url: string) {
  return service<string>({
    url,
    responseType: 'text',
  })
}
