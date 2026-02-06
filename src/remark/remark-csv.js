import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { visit } from 'unist-util-visit';

function extractTitle(metastring) {
    // if (!metastring) return null;
    if (!metastring) return '';
    const match = metastring.match(/title="([^"]+)"/);
    // return match ? match[1] : null;
    return match ? match[1] : '';
}


const DEFAULT_MAX_ROW = 10

function extractMaxRows(metastring) {
    if (!metastring) return DEFAULT_MAX_ROW;
    const match = metastring.match(/maxRows="(\d+)"/);
    return match ? Number(match[1]) : DEFAULT_MAX_ROW;
}

function makeAttribute(type_, name_, value_) {
    return {type: type_, name: name_, value: value_};
}

export default function remarkCsv() {
    return (tree) => {
        visit(tree, "code", (node, index, parent) => {
            if (node.lang !== "csv") return;

            // console.log("[Docusaurus][remarkCsv] node:", node);

            const csvFilePath = path.join(process.cwd(), node.value.trim());

            let csvContent;
            try {
                csvContent = fs.readFileSync(csvFilePath, "utf8");
            } catch {
                throw new Error(`[Docusaurus][remark-csv] Cannot read file: ${csvFilePath}`);
            }

            const records = parse(csvContent, { skip_empty_lines: true });
            const header = records[0];
            const rows = records.slice(1);

            const maxRows = extractMaxRows(node.meta) ?? 10;

            // AST Construction

            const tableContentAst = {
                type: "mdxJsxFlowElement",
                name: "table",
                attributes: [
                    makeAttribute("mdxJsxAttribute", "className", "csvBlockTable"),
                ],
                children: [
                    {
                        type: "mdxJsxFlowElement",
                        name: "thead",
                        attributes: [
                            makeAttribute("mdxJsxAttribute", "className", "csvBlockHead"),
                        ],
                        children: [
                            {
                                type: "mdxJsxFlowElement",
                                name: "tr",
                                attributes: [
                                    makeAttribute("mdxJsxAttribute", "className", "csvBlockRow csvRowHead"),
                                ],
                                children: header.map((col) => ({
                                    type: "mdxJsxFlowElement",
                                    name: "th",
                                    attributes: [
                                        makeAttribute("mdxJsxAttribute", "className", "csvBlockCell csvCellHead"),
                                    ],
                                    children: [{ type: "text", value: col }],
                                })),
                            },
                        ],
                    },

                    {
                        type: "mdxJsxFlowElement",
                        name: "tbody",
                        attributes: [
                            makeAttribute("mdxJsxAttribute", "className", "csvBlockBody"),
                        ],
                        children: rows.map((row) => ({
                            type: "mdxJsxFlowElement",
                            name: "tr",
                            attributes: [
                                makeAttribute("mdxJsxAttribute", "className", "csvBlockRow csvRowBody"),
                            ],
                            children: row.map((cell) => ({
                                type: "mdxJsxFlowElement",
                                name: "td",
                                attributes: [
                                    makeAttribute("mdxJsxAttribute", "className", "csvBlockCell csvCellBody"),
                                ],
                                children: [{ type: "text", value: cell }],
                            })),
                        })),
                    },
                ],
            };


            const tableAst = {
                type: "mdxJsxFlowElement",
                name: "div",
                attributes: [
                    makeAttribute("mdxJsxAttribute", "className", "csvBlock theme-code-block"),
                ],
                children: [
                    {
                        type: "mdxJsxFlowElement",
                        name: "div",
                        attributes: [
                            makeAttribute("mdxJsxAttribute", "className", "csvBlockHeader"),
                        ],
                        children: [
                            {
                                type: "mdxJsxFlowElement",
                                name: "span",
                                attributes: [
                                    makeAttribute("mdxJsxAttribute", "className", "csvBlockTitle"),
                                ],
                                children: [{ type: "text", value: extractTitle(node.meta) }],
                            },
                            {
                                type: "mdxJsxFlowElement",
                                name: "span",
                                attributes: [
                                    makeAttribute("mdxJsxAttribute", "className", "csvBlockLang"),
                                ],
                                children: [{ type: "text", value: "CSV" }],
                            },
                        ],
                    },
                    {
                        type: "mdxJsxFlowElement",
                        name: "div",
                        attributes: [
                            makeAttribute("mdxJsxAttribute", "className", "csvBlockContent"),
                            // makeAttribute("mdxJsxAttribute", "data-max-row", String(extractMaxRows(node.meta) ?? 10)),
                            // makeAttribute("mdxJsxAttribute", "style", "`--csv-max-rows: ${maxRows};`"),
                            makeAttribute("mdxJsxAttribute", "style", { "--csv-max-rows": maxRows }),
                            // {
                            //     type: "mdxJsxAttribute",
                            //     name: "style",
                            //     value: {
                            //         type: "mdxJsxAttributeValueExpression",
                            //         // value: `{"--csv-max-rows": ${extractMaxRows(node.meta)}}`,
                            //         // value: `({ "--csv-max-rows": ${extractMaxRows(node.meta) ?? 10} })`,
                            //         // value: `({ "--csv-max-rows": ${maxRows} })`,
                            //         // value: `{ "--csv-max-rows": ${maxRows} }`,
                            //         value: `{ { "--csv-max-rows": ${maxRows} } }`,
                            //     },
                            // },
                        ],
                        children: [
                            tableContentAst,
                        ],
                    },
                ],
            };

            parent.children[index] = tableAst;
        });
    };
};
