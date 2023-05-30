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

/**
 * @param {HTMLElement} root 
 */
async function bindData(root = document.body) {
    let elements = root.querySelectorAll("[data-text], [data-html], [data-value]");
    for (let element of elements) {
        let data = await getData(element);
        if (data) {
            if (element.dataset.text) {
                element.innerText = data[element.dataset.text];
            }
            if (element.dataset.html) {
                element.innerHTML = data[element.dataset.html];
            }
            if (element.dataset.value) {
                element.value = data[element.dataset.value];
            }
        }
    }
}

export { getData, bindData };