const mapping = {
  js: "JavaScript",
  ts: "TypeScript",

  // css: "CSS",
  // html: "HTML",

  // py: "Python",
  // cpp: "C++",
  // csharp: "C#",
}

function languageAsTitleRemarkPlugin() {
  return async (tree) => {
    const {visit} = await import('unist-util-visit');
    visit(tree, 'code', (node) => {
      if (!node.meta && mapping[node.lang]) {
        node.meta = `title="${mapping[node.lang]}"`;
      }
    });
  };
}

export default languageAsTitleRemarkPlugin;