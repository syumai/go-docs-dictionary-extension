function collectTextNodes(containerEl) {
  const r = [];
  let n;
  const walker = document.createTreeWalker(
    containerEl,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  while ((n = walker.nextNode())) {
    r.push(n);
  }
  return r;
}

function processNode(node, dict) {
  const fragment = document.createDocumentFragment();
  const words = node.textContent.split(/\s+/);
  words.forEach((word) => {
    const div = document.createElement("div");
    div.textContent = word;
    div.className = "word";
    fragment.appendChild(div);
    fragment.appendChild(document.createTextNode(" "));

    const trimmedWord = word.replace(/['",.:;]/g, "");
    const meaning = dict.lookup(trimmedWord);
    if (!meaning) {
      return;
    }
    div.classList.add("word-with-meaning");
    const tooltip = document.createElement("div");
    tooltip.textContent = meaning;
    tooltip.className = "word-translation";
    div.appendChild(tooltip);
  });
  if (fragment.children.length > 0 && fragment.lastChild.textContent === " ") {
    fragment.removeChild(fragment.lastChild);
  }
  node.parentNode.replaceChild(fragment, node);
}
