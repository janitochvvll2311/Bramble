let template = document.createElement("template");
let layouts = {};

/**
 * @param {String} src 
 * @returns {HTMLElement}
 */
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

/**
 * @param {HTMLElement} root 
 */
async function replaceLayouts(root = document.body) {
    let elements = root.querySelectorAll("[data-layout]");
    for (let element of elements) {
        if (!element.brambleLayout) {
            let layout = await getLayout(element.dataset.layout);
            if (layout) {
                element.innerHTML = "";
                for (let attr of layout.attributes) {
                    if (!element.hasAttribute(attr.name)) {
                        element.setAttribute(attr.name, attr.value);
                    }
                }
                for (let child of layout.childNodes) {
                    element.appendChild(child.cloneNode(true));
                }
                element.brambleLayout = layout;
                await replaceLayouts(element);
            }
        }
    }
}

window.brambleLayouts = layouts;

export { getLayout, replaceLayouts };