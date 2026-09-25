/* ============================================================
   SPLIT TEXT — native word/char splitter
   Preserves inline markup (<em>, <strong>, <a>)
   ============================================================ */
export function splitText(el, type = 'words') {
  if (!el || el.dataset.split === 'true') return el;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim()) textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    const text = textNode.nodeValue;

    if (type === 'words') {
      text.split(/(\s+)/).forEach((part) => {
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else if (part.length) {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.display = 'inline-block';
          span.textContent = part;
          fragment.appendChild(span);
        }
      });
    } else {
      [...text].forEach((ch) => {
        if (ch === ' ') {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'char';
          span.style.display = 'inline-block';
          span.textContent = ch;
          fragment.appendChild(span);
        }
      });
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  });

  el.dataset.split = 'true';
  return el;
}