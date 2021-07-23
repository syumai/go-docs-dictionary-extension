async function main() {
  const nodesToIgnore = new Set(["PRE"]);
  const containerEl = document.getElementById("wiki-body");
  const textNodes = collectTextNodes(containerEl);
  const dict = new Dictionary();
  await dict.init();
  for (const node of textNodes) {
    if (nodesToIgnore.has(node.parentNode.nodeName)) {
      continue;
    }
    processNode(node, dict);
  }
}

window.addEventListener("load", main);
