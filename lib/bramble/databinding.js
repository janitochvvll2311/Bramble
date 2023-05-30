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
    let data = await getData(root);
    if (data) {
        if (root.dataset.text) {
            root.innerText = getPathValue(data, root.dataset.text.split("."));
        }
        if (root.dataset.html) {
            root.innerHTML = getPathValue(data, root.dataset.html.split("."));
        }
        if (root.dataset.value) {
            root.value = getPathValue(data, root.dataset.value.split("."));
        }
        if (root.dataset.src) {
            root.src = getPathValue(data, root.dataset.src.split("."));
        }
        if (root.dataset.items && root.itemBinder) {
            let items = getPathValue(data, root.dataset.items.split("."));
            for (let index in items) {
                let iElement = (index < root.children.length) ? root.children.item(index) : null;
                let result = root.itemBinder(iElement, items[index], index);
                if (result instanceof Promise) result = await result;
                if (!result.parentElement) {
                    root.append(result);
                }
            }
            while (root.children.length > items.length) {
                root.lastChild.remove();
            }
        }
    }
    let elements = root.querySelectorAll("[data-text], [data-html], [data-value], [data-src], [data-items]");
    for (let element of elements) {
        bindData(element);
    }
}

export { getData, bindData };