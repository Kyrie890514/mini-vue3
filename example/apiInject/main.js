import { createApp } from '../../lib/mini-vue3.esm.js'
import { App } from './App.js'

const rootConatiner = document.querySelector('#app')
createApp(App).mount(rootConatiner)