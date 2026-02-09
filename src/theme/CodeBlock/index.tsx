import React from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type { Props } from '@theme/CodeBlock';

import HeaderBlock from '@site/src/components/headerBlock'

import useBaseUrl from '@docusaurus/useBaseUrl';

type Language = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const filetypeIconPath = '/img/icons/filetype/'

const languageMapping: Record<string, Language> = {
  text: {label: 'Plain Text', icon: null},
  js: {label: 'JavaScript', icon: filetypeIconPath + 'javascript.svg'},
  jsx: {label: 'JavaScript XML', icon: filetypeIconPath + 'react.svg'},
  ts: {label: 'TypeScript', icon: filetypeIconPath + 'typescript.svg'},
  tsx: {label: 'TypeScript XML', icon: filetypeIconPath + 'react.svg'},
  py: {label: 'Python', icon: filetypeIconPath + 'python.svg'},
  markdown: {label: 'Markdown', icon: filetypeIconPath + 'markdown.svg'},
  json: {label: 'JSON', icon: filetypeIconPath + 'json.svg'},
  css: {label: 'CSS', icon: filetypeIconPath + 'css.svg'},
  html: {label: 'HTML', icon: filetypeIconPath + 'html.svg'},
  cpp: {label: 'C++', icon: filetypeIconPath + 'cpp.svg'},
  csharp: {label: 'C#', icon: filetypeIconPath + 'csharp.svg'},
  go: {label: 'Go', icon: filetypeIconPath + 'go.svg'},
  rust: {label: 'Rust', icon: filetypeIconPath + 'rust.svg'},
  yaml: {label: 'YAML', icon: filetypeIconPath + 'yaml.svg'},
  objectivec: {label: 'Objective C', icon: filetypeIconPath + 'c.svg'},
  swift: {label: 'Swift', icon: filetypeIconPath + 'swift.svg'},
  kotlin: {label: 'Kotlin', icon: filetypeIconPath + 'kotlin.svg'},
  graphql: {label: 'GraphQL', icon: filetypeIconPath + 'graphql.svg'},
  reason: {label: 'Reason', icon: filetypeIconPath + 'reason.svg'},
  bash: {label: 'Bash', icon: filetypeIconPath + 'console.svg'},
  markup: {label: 'Markup', icon: filetypeIconPath + 'xml.svg'},
  // 
  c: {label: 'C', icon: filetypeIconPath + 'c.svg'},
  powershell: {label: 'PowerShell', icon: filetypeIconPath + 'powershell.svg'},
  lua: {label: 'LUA', icon: filetypeIconPath + 'lua.svg'},
  react: {label: 'React', icon: filetypeIconPath + 'react.svg'},
  nodejs: {label: 'NodeJS', icon: filetypeIconPath + 'nodejs.svg'},
  git: {label: 'Git', icon: filetypeIconPath + 'git.svg'},
  gdscript: {label: 'GD Script', icon: filetypeIconPath + 'godot.svg'},
}


function extractTitle(metastring?: string): string | null {
  if (!metastring) return null;
  const match = metastring.match(/title="([^"]+)"/);
  return match ? match[1] : null;
}

function extractFlag(metastring?: string): string | null {
  if (!metastring) return null;
  const match = metastring.match(/flag="([^"]+)"/);
  return match ? match[1] : null;
}

function extractIcon(metastring?: string): any {
  if (!metastring) return null;
  const match = metastring.match(/icon="([^"]+)"/);
  return match ? match[1] : null;
}

function metaUseFlag(metastring?: string): boolean {
  const match = metastring.match(/useFlag="([^"]+)"/);
  if (match) {
    if (match[1] === 'false') return false;
  }
  return true;
}

function metaUseIcon(metastring?: string): boolean {
  const match = metastring.match(/useIcon="([^"]+)"/);
  if (match) {
    if (match[1] === 'false') return false;
  }
  return true;
}

function metaHeader(metastring?: string): boolean {
  if (!metastring) return true;
  const match = metastring.match(/header="([^"]+)"/);
  if (match) {
    if (match[1] === "false") return false;
  }
  return true;
}

function ensureShowLineNumbers(metastring?: string): string {
  if (!metastring || metastring.trim() === '') return 'showLineNumbers';

  const metastringWithoutFields = metastring.replace(/\w+="[^"]*"/g, '');
  const hasFlag = /\bshowLineNumbers(?:=\d+)?\b/.test(metastringWithoutFields);

  if (hasFlag) return metastring;

  return metastring.trim() + ' showLineNumbers';
}


function propsFromMetastring(metastring:string, _flag:string, _icon:string): any {
  
  if (!metaHeader(metastring)) {    // si je ne veux pas afficher le header
    return {title: null, flag: null, icon: null};   // retourne 'null' pour 'title', 'flag' et 'icon'
  }
  
  const title = extractTitle(metastring);   // j'essaie d'extraire un titre: string | null

  let flag: string;   // initialize 'flag'
  if (!metaUseFlag(metastring)) {   // si je ne veux pas afficher 'flag'
    flag = null;                    // j'assigne 'null' à 'flag'
  } else {                                        // sinon
    const resultFlag = extractFlag(metastring);   // j'essaie d'extraire 'flag' depuis 'metastring'
    flag = resultFlag? resultFlag : _flag;        // si l'extraction a reussi j'assigne 'resultFlag' à 'flag', sinon la valeur du param '_flag'
  }

  let icon: string;   // initialize 'icon'
  if (!metaUseIcon(metastring)) {   // si je ne veux pas afficher 'icon'
    icon = null;                    // j'assigne 'null' à 'icon'
  } else {                                        // sinon
    const resultIcon = extractIcon(metastring)    // j'essaie d'extraire 'icon' depuis 'metastring'
    icon = resultIcon? resultIcon : _icon;        // si l'extraction réussi j'assigne 'resultIcon' è 'icon', sinon la valeur du param '_icon'
  }

  return {title: title, flag: flag, icon: icon};
}

function getProps(className:string, metastring:string): any {
  const langId = className?.replace('language-', '');
  const result = languageMapping[langId];

  let meta: string;

  if (result) {     // si j'ai un 'result' ...
    console.log("// Si j'ai un 'result'");
    if (!metastring) {    // si je n'ai pas de 'metastring'
      console.log("    // Si je n'ai pas de 'metastring' ->");
      return {title: null, flag: result.label, icon: result.icon} // je retourne 'flag' et 'icon' mais pas de 'title'
    } else {              // sinon -> j'ai une 'metastring'
      console.log("    // sinon j'ai une 'metastring'");
      const resultProps = propsFromMetastring(metastring, result.label, result.icon);
      return {title: resultProps.title, flag: resultProps.flag, icon: resultProps.icon};
    }

  } else {        // si je n'ai pas de 'result'
    console.log("// Si je n'ai pas de 'result'");
    // je crée une 'metastring' à partir de 'className' et 'metastring', retire le prefix 'language-' et applique un 'trim()'
    meta = String(className + (metastring? metastring:'')).replace('language-', '').trim();
    console.log("// meta= ", meta);
    if (meta === '') {    // si 'meta' est une chaine vide
      console.log("    // si 'meta' est une chaine vide ->")
      return {title: null, flag: null, icon: null};   // retourne 'null' pour 'title', 'flag' et 'icon'
    }                     // sinon j'ai une 'metastring'
    const resultProps = propsFromMetastring(meta, null, null);
    return {title: resultProps.title, flag: resultProps.flag, icon: resultProps.icon};
  }
}


function validateIcon(icon:string): any {
  if (!icon) return null;
  if (icon.endsWith('.svg') || icon.endsWith('.png')) {
    return <img src={useBaseUrl(icon)} width={22} height={22} /> ;
  } else {
    return (icon.length <= 8)? icon : icon.slice(7);
  }
}

export default function CodeBlockWrapper(props: Props): Element {
  const {className, metastring} = props;
  console.log("==============================")
  console.log(`[Docusaurus][CodeBlockWrapper] props=`, props);
  console.log(`[Docusaurus][CodeBlockWrapper] className= ${className} || metastring= ${metastring}`);

  const {title, flag, icon} = getProps(className, metastring);
  console.log(`[Docusaurus][CodeBlockWrapper] getProps -> title= ${title}, flag= ${flag}, icon= ${icon}`);

  return (
    <div className="custom-codeblock">
      {(title || flag || icon) && <HeaderBlock title={title} flag={flag} icon={validateIcon(icon)}/>}
      
      <OriginalCodeBlock {...props} metastring={ensureShowLineNumbers(metastring)} />
    </div>
  );
}
