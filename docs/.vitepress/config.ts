import { defineConfig } from 'vitepress'
import vue from '@vitejs/plugin-vue'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue dPicker",
  description: "A Vue Datepicker component",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/date-picker' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Components',
        items: [
          { text: 'DatePicker', link: '/components/date-picker' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryun-dev/vue-dpicker' }
    ]
  }
})
