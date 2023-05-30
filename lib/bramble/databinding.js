/**
 * @param {*} obj 
 * @param {String[]} path 
 * @returns {*}
 */
function getPathValue(obj, path) {
    let data = obj;
    for (let part of path) {
        if (!data) {
            return undefined;
        }
        data = data[part];
    }
    return data;
}

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
                    closest.brambleData = getPathValue(data, closest.dataset.path.split("."))
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
                element.innerText = getPathValue(data, element.dataset.text.split("."));
            }
            if (element.dataset.html) {
                element.innerHTML = getPathValue(data, element.dataset.html.split("."));
            }
            if (element.dataset.value) {
                element.value = getPathValue(data, element.dataset.value.split("."));
            }
        }
    }
}

export { getData, bindData };