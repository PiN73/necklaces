function code_to_indices(n, k, code) {
    let i = code;
    const indices = [];
    range(n).forEach(() => {
        indices.push(i % k);
        i = Math.floor(i / k); // i /= k
    });
    return indices;
}

function indices_to_code(k, indices) {
    let code = 0;
    for (const [i, index] of indices.entries()) {
        code += index * Math.pow(k, i);
    }
    return code;
}

const svg_ns = 'http://www.w3.org/2000/svg';
const svg_el = name => document.createElementNS(svg_ns, name);

const a = 100;
const R = 33;
const r = 10;

function draw_necklace(colors, indices) {
    const svg = svg_el('svg');
    svg.setAttribute('width', a);
    svg.setAttribute('height', a);

    const contour = svg_el('circle');
    contour.setAttribute('cx', a / 2);
    contour.setAttribute('cy', a / 2);
    contour.setAttribute('r', R);
    contour.setAttribute('stroke', 'gray');
    contour.setAttribute('stroke-width', 3);
    contour.setAttribute('fill', 'none');
    svg.appendChild(contour);

    for (const [i, index] of indices.entries()) {
        const bead = svg_el('circle');
        const alpha = i / indices.length * 2 * Math.PI;
        bead.setAttribute('cx', a / 2 + R * Math.cos(alpha));
        bead.setAttribute('cy', a / 2 - R * Math.sin(alpha));
        bead.setAttribute('r', r);
        bead.setAttribute('fill', colors[index]);
        svg.appendChild(bead);
    }

    return svg;
}

function canonize(n, k, code) {
    let result = Number.MAX_SAFE_INTEGER;
    const indices = code_to_indices(n, k, code);
    range(indices.length).forEach(() => {
        indices.push(indices.shift());
        result = Math.min(result, indices_to_code(k, indices));
    });
    return result;
}

function draw_color_counts(colors, color_counts) {
    const nonzero_color_counts = color_counts
        .map((count, i) => [i, count])
        .filter(([i, count]) => count != 0);
    const svg = svg_el('svg');
    const w = 2 * r * nonzero_color_counts.length;
    const h = 2 * r * Math.max(...color_counts)
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    for (const [pos, [i, count]] of Object.entries(nonzero_color_counts)) {
        range(count).forEach(j => {
            const bead = svg_el('circle');
            bead.setAttribute('cx', pos * 2 * r + r);
            bead.setAttribute('cy', h - j * 2 * r - r);
            bead.setAttribute('r', r);
            bead.setAttribute('fill', colors[i]);
            svg.appendChild(bead);
        });
    }

    return svg;
}

function generate_canonical_necklaces_grouped(n, k) {
    const canonical_necklaces = range(Math.pow(k, n)).map(code => canonize(n, k, code));
    const unique_canonical_necklaces = new Set(canonical_necklaces);

    const groups = {};
    for (const code of unique_canonical_necklaces) {
        const indices = code_to_indices(n, k, code);
        const color_counts = Array(k).fill(0);
        for (const c of indices) {
            color_counts[c] += 1;
        }
        const group_key = color_counts.join('_');
        if (!(group_key in groups)) {
            groups[group_key] = [];
        }
        groups[group_key].push(code);
    }
    return groups;
}

function draw_canonical_necklaces_group(n, k, colors, [group_key, group_codes]) {
    const row = document.createElement('div');
    const color_counts = group_key.split('_').map(str_to_int);
    const color_counts_div = draw_color_counts(colors, color_counts);
    color_counts_div.style.padding = `${r}px`;
    row.appendChild(color_counts_div);
    for (const code of group_codes) {
        const necklace_div = draw_necklace(colors, code_to_indices(n, k, code));
        row.appendChild(necklace_div);
    }
    return row;
}

function draw_canonical_necklaces_grouped(n, k) {
    const groups = generate_canonical_necklaces_grouped(n, k);
    const colors = palette(k);

    const result = document.createElement('div');
    for (const [key, codes] of Object.entries(groups)) {
        const row = draw_canonical_necklaces_group(n, k, colors, [key, codes]);
        row.style.display = 'flex';
        row.style.alignItems = 'center';

        // either wrap:
        // row.style.flexWrap = 'wrap';

        // or enable horizontal scrolling:
        row.style.overflowX = 'auto'; // make row scroll (not the whole page)
        for (const child of row.childNodes) {
            child.style.flexShrink = 0;
        }

        result.appendChild(row);
    }
    return result;
}

export default {
    props: ['n', 'k'],
    computed: {
        inner_html() {
            return draw_canonical_necklaces_grouped(+this.n, +this.k).innerHTML;
        },
    },
    template: `<div v-html='inner_html'></div>`,
}

const range = n => [...Array(n).keys()];

const str_to_int = s => parseInt(s, 10);

const palette = n => range(n)
    .map(i => `hsl(${i * (360 / n)}, 100%, 50%)`);
