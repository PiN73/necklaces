import Mathjax from './mathjax.mjs'

export default {
    props: {
        n: Number,
        k: Number,
    },
    components: {
        Mathjax,
    },
    computed: {
        math() {
            //return `$$n = ${this.n}, k = ${this.k}$$`;
            return calc(this.n, this.k);
        }
    },
    template: `<Mathjax :math=math></Mathjax>`
}

const r = String.raw;

const calc = (n, k) => r`
    $$ |C| = $$
    $$ = \frac{1}{  n } \sum_{q|  n } ${func(r`\frac{  n }{q}`, r`  k ^q`)} = $$
    $$ = \frac{1}{${n}} \sum_{q|${n}} ${func(r`\frac{${n}}{q}`, r`${k}^q`)} = $$
` + calc_parts(n, k);

function calc_parts(n, k) {
    let result = '';
    const qs = [...dividers(n)];

    result += r`$$ = \frac{1}{${n}} \left(`
    result += qs.map(q => func(r`\frac{${n}}{${q}}`, r`${k}^${q}`)).join(' + ');
    result += r`\right) = $$`

    result += r`$$ = \frac{1}{${n}} \left(`
    result += qs.map(q => func(r`${n / q}`, r`${Math.pow(k, q)}`)).join(' + ');
    result += r`\right) = $$`

    result += r`$$ = \frac{1}{${n}} \left(`
    result += qs.map(q => r`${phi(n / q)} \cdot ${Math.pow(k, q)}`).join(' + ');
    result += r`\right) = $$`

    result += r`$$ = \frac{1}{${n}} \left(`
    result += qs.map(q => r`${phi(n / q) * Math.pow(k, q)}`).join(' + ');
    result += r`\right)`

    result += r`= \frac{1}{${n}} \cdot`
    result += sum(qs.map(q => phi(n / q) * Math.pow(k, q)));
    result += r` = ` + 1 / n * sum(qs.map(q => phi(n / q) * Math.pow(k, q))) + r`$$`;

    return result;
}

function* dividers(n) {
    for (let i = 1; i <= n; ++i) {
        if (n % i == 0) {
            yield i;
        }
    }
}

const func = (arg, rest) => r`\varphi \left( ${arg} \right) \cdot ${rest}`;

function phi(n) {
    let result = n;
	for (let i=2; i*i<=n; ++i) {
		if (n % i == 0) {
			while (n % i == 0)
                n /= i;
			result -= result / i;
        }
    }
	if (n > 1)
		result -= result / n;
	return result;
}

const sum = arr => arr.reduce((a, b) => a + b, 0);
