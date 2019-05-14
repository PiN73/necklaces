import Vue from './vue.mjs'

export default {
    props: {
        math: String,
    },
    watch: {
        'window.MathJax'() {
            this.renderMathJax()
        },
        math() {
            Vue.nextTick(() => this.renderMathJax());
        },
    },
    mounted() {
        this.renderMathJax()
    },
    methods: {
        renderMathJax() {
            if (window.MathJax) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, this.$refs.mathJaxEl]);
            }
        }
    },
    template: `<div ref="mathJaxEl" v-html="math"></div>`
}