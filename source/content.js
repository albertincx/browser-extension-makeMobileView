const ce = (ta = 'meta') => document.createElement(ta);
const MOB_VIEWPORT_META = '<meta id="meta_mmb" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">';

function createElementFromHTML(htmlString) {
	if (document.getElementById('meta_mmb')) {
		return;
	}
	const div = ce();
	div.id = 'meta_mmb';
	div.innerHTML = htmlString.trim();
	// Change this to div.childNodes to support multiple top-level nodes.
	return div.firstChild;
}

const windowOuterWidth = window.outerWidth;
let styled_added = false;
const MKMB = 'Make Mobile';
const NO_MKMB = 'Clear Mobile';
const MAX_WIDTH = windowOuterWidth + "px";
const MMB_CLASS_NAME = 'mmb_cl__aaa';

function loop(node) {
	// do some thing with the node here
	var nodes = node.childNodes;
	for (var i = 0; i < nodes.length; i++) {
		if (!nodes[i]) {
			continue;
		}
		if (nodes[i] && nodes[i].offsetWidth) {
			// check if block is wider
			if (windowOuterWidth < nodes[i].offsetWidth || windowOuterWidth < nodes[i].scrollWidth) {
				nodes[i].style.width = MAX_WIDTH;
				nodes[i].style.maxWidth = MAX_WIDTH;
				nodes[i].style.minWidth = MAX_WIDTH;
				if (!nodes[i].classList.contains(MMB_CLASS_NAME)) {
					nodes[i].classList.add(MMB_CLASS_NAME);
					if (!styled_added) {
						document.head.insertAdjacentHTML("beforeend", `
<style id="style_mmb">.${MMB_CLASS_NAME}{
width:${MAX_WIDTH} !important;display: block;
    padding: 0;}</style>
`);
						styled_added = true;
					}
				}
			}
		}
		if (nodes[i].childNodes.length > 0) {
			loop(nodes[i]);
		}
	}
}

async function init() {
	// console.log(' Content script loaded for', chrome.runtime.getManifest().name);
	const container = ce('div');
	const btn = ce('div');
	const spn = ce('span');
	container.classList.add('open');
	btn.classList.add('btn');
	spn.innerHTML = MKMB;
	document.body.prepend(container);
	container.append(spn);
	container.append(btn);
	container.id = 'mmbl-text-notice';
	btn.onclick = (e) => {
		e.stopPropagation();
		container.classList.toggle('open');
	};
	spn.onclick = function () {
		if (spn.innerHTML === MKMB) {
			// add magic
			document.head.appendChild(createElementFromHTML(MOB_VIEWPORT_META));
			// resize all elements
			loop(document);
			spn.innerHTML = NO_MKMB;
		} else {
			if (document.getElementById('style_mmb')) {
				document.getElementById('style_mmb').remove();
			}
			if (document.getElementById('meta_mmb')) {
				document.getElementById('meta_mmb').remove();
			}
			spn.innerHTML = MKMB;
		}
	};
}

var touchDevice = ('ontouchstart' in document.documentElement);
// work only in mobile mode
touchDevice && init();
