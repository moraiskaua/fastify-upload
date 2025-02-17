import type { Options } from 'tsup';

export const tsup: Options = {
  clean: true,
  entryPoints: ['src'],
  format: ['esm'],
  outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.js' }),
  config: 'tsconfig.json',
  loader: {
    '.sql': 'text',
  },
};
