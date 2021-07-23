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

function lookupWord(word) {
  const stem = word2stem[word.toLowerCase()];
  if (!stem) {
    return "";
  }
  const meaning = dic[stem];
  if (!meaning) {
    return "";
  }
  return meaning;
}

function processNode(node) {
  const fragment = document.createDocumentFragment();
  const words = node.textContent.split(/\s+/);
  words.forEach((word) => {
    const div = document.createElement("div");
    div.textContent = word;
    div.className = "word";
    fragment.appendChild(div);
    fragment.appendChild(document.createTextNode(" "));

    const trimmedWord = word.replace(/['",.:;]/g, "");
    const meaning = lookupWord(trimmedWord);
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
  // workaround to avoid making h2 > pre and h3 > pre
  // if (node.parentNode.nodeName == "H2" || node.parentNode.nodeName == "H3") {
  // wrap by div
  /*
  const div = document.createElement("div");
  div.className = "word-container";
  div.appendChild(fragment);
  node.parentNode.replaceChild(div, node);
  */
  //  } else {
  node.parentNode.replaceChild(fragment, node);
  // }
}
