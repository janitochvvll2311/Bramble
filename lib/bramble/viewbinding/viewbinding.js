
/**
 * @param {HTMLElement} root 
 * @returns {*}
 */
async function getViews(root = document.body) {
    if (!root.brambleViews) {
        let bag = {};
        let elements = root.querySelectorAll("[data-view]");
        for (let element of elements) {
            bag[element.dataset.view] = element;
        }
        root.brambleViews = bag;
    }
    return root.brambleViews;
}

export { getViews };