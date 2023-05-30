import { getViews } from "../../../lib/bramble/viewbinding/viewbinding.js";

let views = await getViews();
console.log(views);

views.title.innerText = "My Title";
views.content.innerText = "My Content";