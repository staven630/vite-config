import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import eslintPlugin from 'vite-plugin-eslint'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import viteSvgIcons from 'vite-plugin-svg-icons'
import { visualizer } from 'rollup-plugin-visualizer'
import importToCDN from 'vite-plugin-cdn-import'

import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver,
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

import path from 'path'

const nodeResolve = (dir) => path.resolve(__dirname, dir)

export default ({ mode }: ConfigEnv): UserConfig => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  }

  const IS_PROD = ['prod', 'production'].includes(mode)

  // alias
  const resolve = {
    alias: {
      '@': nodeResolve('src'),
      '~': nodeResolve('public'),
    },
  }

  // server
  const server = {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.1.163:8081/',
        changeOrigin: true,
        rewrite: (url) => url.replace(/^\/api/, ''),
      },
    },
  }

  const css = {
    preprocessorOptions: {
      less: {
        additionalData: `@text-color: red;`,
        // additionalData: '@import "@/assets/less/variables.less";',
        javascriptEnabled: true,
      },
      scss: {
        additionalData: `$injectedColor: orange;`,
        // additionalData: `@import "@/assets/scss/variables.scss";`,
        javascriptEnabled: true,
      },
    },
  }

  let plugins = [
    vue(),
    vueJsx(),
    vueSetupExtend(),
    viteSvgIcons({
      // 指定需要缓存的图标文件夹
      iconDirs: [nodeResolve('icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      // 是否压缩
      svgoOptions: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({}),
    // Components({
    //   resolvers: [AntDesignVueResolver()],
    // }),
  ]

  if (!IS_PROD) {
    plugins = [
      ...plugins,
      eslintPlugin({
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'],
      }),
    ]
  }

  if (IS_PROD) {
    plugins = [
      ...plugins,
      viteExternalsPlugin({
        vue: 'Vue',
        react: 'React',
        'react-dom': 'ReactDOM',
        // value support chain, tranform to window['React']['lazy']
        lazy: ['React', 'lazy'],
      }),
      visualizer(),
      importToCDN({
        modules: [
          {
            name: 'cesium',
            var: 'Cesium',
            path: `https://cesium.com/downloads/cesiumjs/releases/1.88/Build/Cesium/Cesium.js`,
          },
          {
            name: 'widgets',
            path: `https://cesium.com/downloads/cesiumjs/releases/1.88/Build/Cesium/Widgets/widgets.css`,
          },
        ],
      }),
    ]
  }

  return {
    // base: process.env.VITE_BASE_PATH,
    plugins,
    resolve,
    css,
    server,
  }
}
