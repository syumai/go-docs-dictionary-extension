function main() {
  const nodesToIgnore = new Set(["PRE"]);
  const containerEl = document.getElementById("wiki-body");
  const textNodes = collectTextNodes(containerEl);
  for (const node of textNodes) {
    if (nodesToIgnore.has(node.parentNode.nodeName)) {
      continue;
    }
    processNode(node);
  }
}

window.addEventListener("load", main);
