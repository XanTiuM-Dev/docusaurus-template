import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { visit } from "unist-util-visit";

function extractTitle(meta?: string) {
  if (!meta) return "";
  const match = meta.match(/title="([^"]+)"/);
  return match ? match[1] : "";
}

function extractMaxRows(meta?: string) {
  if (!meta) return 10;
  const match = meta.match(/maxRows="(\d+)"/);
  return match ? Number(match[1]) : 10;
}

export default function remarkCsv() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "csv") return;

      const csvFilePath = path.join(process.cwd(), node.value.trim());
      const csvContent = fs.readFileSync(csvFilePath, "utf8");
      const records = parse(csvContent, { skip_empty_lines: true });

      const title = extractTitle(node.meta);
      const maxRows = extractMaxRows(node.meta);

      const jsxNode = {
        type: "mdxJsxFlowElement",
        name: "CSVTable",
        attributes: [
          { type: "mdxJsxAttribute", name: "title", value: title },
          { type: "mdxJsxAttribute", name: "src", value: csvFilePath },
          { type: "mdxJsxAttribute", name: "maxRows", value: maxRows },
          { type: "mdxJsxAttribute", name: "data", value: records },
        ],
        children: [],
      };

      parent.children[index] = jsxNode;
    });
  };
}
