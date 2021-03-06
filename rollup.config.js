module.exports = {
  input     : 'lib/index.js',
  external  : [ 'mobx' ],
  output  : [
    {
      name    : 'mobxJSONPatch',
      format  : 'umd',
      globals : { mobx : 'mobx' },
      file    : 'mobx-to-jsonpatch.umd.js',
    },
    {
      name    : 'mobxJSONPatch',
      format  : 'es',
      globals : { mobx : 'mobx' },
      file    : 'mobx-to-jsonpatch.module.js',
    },
  ],
}
