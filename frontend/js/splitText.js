/* ============================================================
   SPLIT TEXT — native word/char splitter
   Preserves inline markup (<em>, <strong>, <a>)
   Does NOT wrap whitespace-only characters as .char spans
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
      // Split into chars, but keep whitespace as plain text nodes
      [...text].forEach((ch) => {
        if (/\s/.test(ch)) {
          // Whitespace → plain text node (NOT a .char span)
          fragment.appendChild(document.createTextNode(ch));
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