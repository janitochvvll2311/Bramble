/**
 * @param {HTMLElement} root 
 * @returns {*}
 */
async function getData(root = document.body) {
    let closest = root.closest("[data-source], [data-path]");
    if (closest) {
        if (!closest.brambleData) {
            let data = undefined;
            if (closest.dataset.source) {
                let response = await fetch(closest.dataset.source);
                if (response.ok) {
                    data = await response.json();
                }
            }
            else {
                data = await getData(closest.parentElement);
            }
            if (closest.dataset.path) {
                if (data) {
                    closest.brambleData = data[closest.dataset.path];
                }
            }
            else {
                closest.brambleData = data;
            }
        }
        return closest.brambleData;
    }
    return undefined;
}

export { getData };