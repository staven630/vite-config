import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import eslintPlugin from 'vite-plugin-eslint'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import viteSvgIcons from 'vite-plugin-svg-icons'

import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver,
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

import path from 'path'

const resolve = (dir) => path.resolve(__dirname, dir)

export default ({ mode }: ConfigEnv): UserConfig => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  }

  const IS_PROD = ['prod', 'production'].includes(process.env.NODE_ENV)

  return {
    // base: process.env.VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx(),
      vueSetupExtend(),
      eslintPlugin({
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'],
      }),
      viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
        // 是否压缩
        svgoOptions: true,
      }),
      viteExternalsPlugin({
        vue: 'Vue',
        react: 'React',
        'react-dom': 'ReactDOM',
        // value support chain, tranform to window['React']['lazy']
        lazy: ['React', 'lazy'],
      }),
      Components({
        resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
      }),
      ElementPlus({}),
    ],
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     less: {
    //       additionalData: `@text-color: red;`,
    //       // additionalData: '@import "@/assets/less/variables.less";',
    //       javascriptEnabled: true,
    //     },
    //     scss: {
    //       additionalData: `$injectedColor: orange;`,
    //     },
    //   },
    // },
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://192.168.1.163:8081/',
    //       changeOrigin: true,
    //       rewrite: (url) => url.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  }
}
