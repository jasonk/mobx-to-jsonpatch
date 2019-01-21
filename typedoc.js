module.exports = {
  out                 : './docs',
  readme              : './README.md',
  includes            : './src',
  excludes            : [ './src/index.ts' ],
  mode                : 'modules',
  excludeExternals    : true,
  excludeNotExported  : true,
  excludePrivate      : true,
  target              : 'es5',
  module              : 'commonjs',
};
