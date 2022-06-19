import { createApp } from 'vue'
import App from './App.vue'

import './styles/main.css'
import 'uno.css'

const container = (parent: Element, cls = '') => {
  const appContainer = document.createElement('div')
  if (cls)
    appContainer.classList.add(cls)
  parent.insertBefore(appContainer, parent.firstChild)
  return appContainer
}

const el = container(document.body, 'tm-main-app')
const app = createApp(App)
app.mount(el)
