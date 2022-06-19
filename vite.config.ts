/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import tampermonkey from 'vite-plugin-tampermonkey'
import { visualizer } from 'rollup-plugin-visualizer'

const prod = process.env.NODE_ENV === 'production'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        '@vueuse/core',
      ],
      dts: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      resolvers: [
        NaiveUiResolver(),
      ],
      dts: true,
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
    ...(prod
      ? [visualizer()]
      : []),
    tampermonkey({
      externalGlobals: [
        'vue',
        ['@vueuse/core', 'VueUse'],
        ['@vueuse/shared', ''],
        ['axios', 'axios'],
        {
          pkgName: 'lodash-es',
          varName: '_',
          path: 'https://unpkg.com/lodash@4.17.21/lodash.js',
        },
        ['@juggle/resize-observer', 'ResizeObserver'],
        {
          pkgName: 'this.globalThis=this;this.Vue=Vue;',
          type: 'code',
        },
        {
          pkgName: 'naive-ui',
          varName: 'naive',
          path: '/dist/index.prod.js',
        },
        {
          pkgName: 'axios-userscript-adapter',
          path: '/dist/axiosGmxhrAdapter.min.js',
          varName: 'axiosGmxhrAdapter',
        },
      ],
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
    setupFiles: ['/src/tests/setup.js'],
  },
})
