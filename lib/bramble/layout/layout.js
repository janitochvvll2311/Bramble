let template = document.createElement("template");
let layouts = {};

async function getLayout(src) {
    if (!layouts[src]) {
        let response = await fetch(src);
        if (response.ok) {
            template.innerHTML = await response.text();
            layouts[src] = template.content.firstElementChild;
        }
    }
    return layouts[src];
}

async function replaceLayouts(root = document.body) {
    let elements = root.querySelectorAll("[data-layout]");
    for (let element of elements) {
        if (!element.brambleLayout) {
            let layout = await getLayout(element.dataset.layout);
            if (layout) {
                let _element = layout.cloneNode(true);
                _element.brambleLayout = layout;
                for (let attr of element.attributes) {
                    _element.setAttribute(attr.name, attr.value);
                    element.replaceWith(_element);
                }
                await replaceLayouts(_element);
            }
        }
    }
}

window.brambleLayouts = layouts;

export { getLayout, replaceLayouts };