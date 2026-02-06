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

function extractMaxRows(metastring) {
    if (!metastring) return null;
    const match = metastring.match(/maxRows=(\d+)/);
    return match ? Number(match[1]) : 10;
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

            // AST Construction

            const tableContentAst = {
                type: "mdxJsxFlowElement",
                name: "table",
                attributes: [
                    makeAttribute("mdxJsxAttribute", "className", "csvBlockTable"),
                    // {
                    //     type: "mdxJsxAttribute",
                    //     name: "className",
                    //     value: "csvBlockTable",
                    // },
                ],
                children: [
                    {
                        type: "mdxJsxFlowElement",
                        name: "thead",
                        attributes: [
                            {
                                type: "mdxJsxAttribute",
                                name: "className",
                                value: "csvBlockHead",
                            },
                        ],
                        children: [
                            {
                                type: "mdxJsxFlowElement",
                                name: "tr",
                                attributes: [
                                    {
                                        type: "mdxJsxAttribute",
                                        name: "className",
                                        value: "csvBlockRow csvRowHead",
                                    },
                                ],
                                children: header.map((col) => ({
                                    type: "mdxJsxFlowElement",
                                    name: "th",
                                    attributes: [
                                        {
                                            type: "mdxJsxAttribute",
                                            name: "className",
                                            value: "csvBlockCell csvCellHead",
                                        },
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
                            {
                                type: "mdxJsxAttribute",
                                name: "className",
                                value: "csvBlockBody",
                            },
                        ],
                        children: rows.map((row) => ({
                            type: "mdxJsxFlowElement",
                            name: "tr",
                            attributes: [
                                {
                                    type: "mdxJsxAttribute",
                                    name: "className",
                                    value: "csvBlockRow csvRowBody",
                                },
                            ],
                            children: row.map((cell) => ({
                                type: "mdxJsxFlowElement",
                                name: "td",
                                attributes: [
                                    {
                                        type: "mdxJsxAttribute",
                                        name: "className",
                                        value: "csvBlockCell csvCellBody",
                                    },
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
                    {
                        type: "mdxJsxAttribute",
                        name: "className",
                        value: "csvBlock theme-code-block",
                    },
                ],
                children: [
                    {
                        type: "mdxJsxFlowElement",
                        name: "div",
                        attributes: [
                            {
                                type: "mdxJsxAttribute",
                                name: "className",
                                value: "csvBlockHeader",
                            },
                        ],
                        children: [
                            {
                                type: "mdxJsxTextElement",
                                name: "span",
                                attributes: [
                                    {
                                        type: "mdxJsxAttribute",
                                        name: "className",
                                        value: "csvBlockTitle",
                                    },
                                ],
                                children: [{ type: "text", value: extractTitle(node.meta) }],
                            },
                            {
                                type: "mdxJsxTextElement",
                                name: "span",
                                attributes: [
                                    {
                                        type: "mdxJsxAttribute",
                                        name: "className",
                                        value: "csvBlockLang",
                                    },
                                ],
                                children: [{ type: "text", value: "CSV" }],
                            },
                        ],
                    },
                    {
                        type: "mdxJsxFlowElement",
                        name: "div",
                        attributes: [
                            {
                                type: "mdxJsxAttribute",
                                name: "className",
                                value: "csvBlockContent",
                            },
                            // {
                            //     type: "mdxJsxAttribute",
                            //     name: "style",
                            //     value: {
                            //         type: "mdxJsxAttributeValueExpression",
                            //         value: `{"--csv-max-rows": ${extractMaxRows(node.meta)}}`,
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
