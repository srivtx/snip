import prettier from 'prettier';

const PARSER_MAP = {
  javascript: 'babel',
  typescript: 'typescript',
  jsx: 'babel',
  tsx: 'typescript',
  json: 'json',
  css: 'css',
  scss: 'css',
  html: 'html',
  htm: 'html',
  xml: 'html',
  markdown: 'markdown',
  md: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
  vue: 'vue',
  svelte: 'svelte',
  graphql: 'graphql',
  gql: 'graphql',
};

export async function beautify(code, lang) {
  if (!code || !code.trim()) return code;
  const parser = PARSER_MAP[(lang || '').toLowerCase()];
  if (!parser) return code;
  try {
    return await prettier.format(code, {
      parser,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
    });
  } catch {
    return code;
  }
}

export const SUPPORTED_LANGS = Object.keys(PARSER_MAP);
