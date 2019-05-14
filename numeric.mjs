export default {
    props: {
        initial: Number,
    },
    data: function () {
        return {
            val: this.initial,
        };
    },
    watch: {
        val(new_val) {
            this.$emit('onchange', new_val);
        },
    },
    template: `<p>
            <button class=sign @click='val > 1 ? val -= 1 : null'>−</button>
            <span id=n_span style='margin: 0.5em'>{{ val }}</span>
            <button class=sign @click='val += 1'>+</button>
            <span style='margin-left: 1em'><slot></slot></span>
        </p>`,
}