import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Vue DPicker",
    description: "A Vue Datepicker component",
    base: '/vue-dpicker/',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Components', link: '/components/date-picker'},
            {text: 'Examples', link: '/examples'}
        ],

        sidebar: [
            {
                text: 'Components',
                items: [
                    {text: 'DatePicker', link: '/components/date-picker'},
                    {text: 'Examples', link: '/examples'}
                ]
            }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: `Copyright © ${new Date().getFullYear()} HumboldtWeb. All rights reserved.`
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/ryun-dev/vue-dpicker'}
        ]
    }
})
