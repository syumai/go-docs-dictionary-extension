import { collectTextNodes, processNode } from "./nodes.js";

const textNodes = collectTextNodes();
for (const node of textNodes) {
  if (node.parentNode.nodeName === "PRE") {
    continue;
  }
  processNode(node);
}
