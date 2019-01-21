import {
  Pointer, encodePart, decodePart, encodePath, decodePath,
} from '../src/Pointer';

const equivs = [
  // from: JSONPatch, Array, Entry
  // to: JSONPatch, JSON, String,
  {
    JSONPatch : '/foo/bar/baz/gazonk',
    Array     : [ 'foo', 'bar', 'baz', 'gazonk' ],
    String    : '/foo/bar/baz/gazonk',
    JSON      : '/foo/bar/baz/gazonk',
  },
  {
    JSONPatch : '/foo~0bar/baz~0gazonk',
    Array     : [ 'foo~bar', 'baz~gazonk' ],
    String    : '/foo~0bar/baz~0gazonk',
    JSON      : '/foo~0bar/baz~0gazonk',
  },
];
const part_equivs = {
  'foo/bar'     : 'foo~1bar',
  'foo~bar'     : 'foo~0bar',
  'foo~/~bar'   : 'foo~0~1~0bar',
  '~~~~~'       : '~0~0~0~0~0',
  '~~//~~'      : '~0~0~1~1~0~0',
};

describe( 'Pointer', () => {

  Object.keys( part_equivs ).forEach( key => {
    const val = part_equivs[ key ];
    it( `should be able to encode "${key}"`, () => {
      encodePart( key ).should.equal( val );
    } );
    it( `should be able to decode "${val}"`, () => {
      decodePart( val ).should.equal( key );
    } );
  } );

  equivs.forEach( equiv => {
    const keys = Object.keys( equiv );
    keys.forEach( key => {
      describe( `${key} "${equiv[key]}" ...`, () => {
        if ( typeof Pointer[ `from${key}` ] !== 'function' ) return;
        const pathobj = Pointer[ `from${key}` ]( equiv[ key ] );
        keys.forEach( key2 => {
          if ( typeof pathobj[ `to${key2}` ] !== 'function' ) return;
          it( `... ${key2} "${equiv[key2]}"`, () => {
            pathobj[ `to${key2}` ]().should.eql( equiv[ key2 ] );
          } );
        } );
      } );
    } );
  } );

} );
