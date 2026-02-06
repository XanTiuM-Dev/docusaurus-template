import React from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type { Props } from '@theme/CodeBlock';

// #TODO afficher le langage même sans title {DONE ?}
// #TODO ajouter une icone par langage
// #TODO check le scroll lateral quand une ligne est trop longue

const mapping: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'JavaScript JSX',
//   js-extras: 'JavaScript Extra',
  ts: 'TypeScript',
  tsx: 'TypeScript JSX',
  css: 'CSS',
  html: 'HTML',
  py: 'Python',
  cpp: 'C++',
  csharp: 'C#',
  markdown: 'Markdown',
  rust: 'Rust',
  yaml: 'YAML',
  go: 'Go Lang',
  json: 'JSON',
  swift: 'Swift',
  kotlin: 'Kotlin',
  graphql: 'GraphQL',
  reason: 'Reason',
  objectivec: 'Objective C',
  markup: 'Markup',
};

function extractTitle(metastring?: string): string | null {
  if (!metastring) return null;
  const match = metastring.match(/title="([^"]+)"/);
  return match ? match[1] : null;
}

// export default function CodeBlockWrapper(props: Props): JSX.Element {
export default function CodeBlockWrapper(props: Props): Element {
  const { className, metastring } = props;

  const langId = className?.replace('language-', '');
  const language = langId ? mapping[langId] : null;
  const title = extractTitle(metastring);

  return (
    <div className="custom-codeblock">
      {(title || language) && (
        <div className="custom-codeblock-header">
          <span className="custom-codeblock-title">
            {title}
          </span>
          {language && (
            <span className="custom-codeblock-lang">
              {language}
            </span>
          )}
        </div>
      )}

      <OriginalCodeBlock {...props} />
    </div>
  );
}
