import { Patches } from '../src/Patches';
import { Pointer } from '../src/Pointer';

describe( 'Patches', () => {

  const patchset: Patches = new Patches();
  const expectations = [];
  function expect( ...x ) {
    expectations.push( ...x );
    patchset.toJSON().should.eql( expectations );
  }

  it( 'should be able to build', () => {
    patchset.should.be.an( 'object' );
    patchset.should.be.an.instanceOf( Patches );
  } );

  it( 'should be able to take an array to start with', () => {
    const ps1 = new Patches( [
      { op : "copy", from : '/x', path : '/y' },
    ] );
    ps1.toJSON().should.eql( [
      { op : "copy", from : '/x', path : '/y' },
    ] );
  } );

  it( 'should support op "add"', () => {
    patchset.add( '/foo', { bar : 'baz' } );
    expect( { op : 'add', path : '/foo', value : { bar : 'baz' } } );
    patchset.add( new Pointer( '/bar' ), { gaz : 'onk' } );
    expect( { op : 'add', path : '/bar', value : { gaz : 'onk' } } );
  } );

  it( 'should support op "replace"', () => {
    patchset.replace( '/foo', { baz : 'bar' } );
    expect( { op : 'replace', path : '/foo', value : { baz : 'bar' } } );
    patchset.replace(
      new Pointer( [ 'foo' ] ),
      { baz : 'bar', more : 'cowbell' },
    );
    expect( {
      op : 'replace', path : '/foo',
      value : { baz : 'bar', more : 'cowbell' },
    } );
  } );

  it( 'should support op "remove"', () => {
    patchset.add( '/thing1', { likes : 'thing2' } );
    patchset.add( '/thing2', { likes : 'thing1' } );
    expect(
      { op : 'add', path : '/thing1', value : { likes : 'thing2' } },
      { op : 'add', path : '/thing2', value : { likes : 'thing1' } },
    );
    patchset.remove( '/thing1' );
    expect( { op : 'remove', path : '/thing1' } );
    patchset.remove( new Pointer( '/thing2' ) );
    expect( { op : 'remove', path : '/thing2' } );
  } );

  it( 'should support op "replace"', () => {
    patchset.replace( '/foo', { baz : 'bar' } );
    expect( { op : 'replace', path : '/foo', value : { baz : 'bar' } } );
  } );

  it( 'should support op "copy"', () => {
    patchset.copy( '/foo', '/foo2' );
    expect( { op : 'copy', from : '/foo', path : '/foo2' } );
    patchset.copy( new Pointer( '/foo' ), '/foo4' );
    patchset.copy( '/foo', new Pointer( '/foo5' ) );
    expect(
      { op : 'copy', from : '/foo', path : '/foo4' },
      { op : 'copy', from : '/foo', path : '/foo5' },
    );
  } );

  it( 'should support op "move"', () => {
    patchset.move( '/foo', '/foo3' );
    expect( { op : 'move', from : '/foo', path : '/foo3' } );
    patchset.move( '/foo3', new Pointer( [ 'foo6' ] ) );
    expect( { op : 'move', from : '/foo3', path : '/foo6' } );
    patchset.move(
      Pointer.fromArray( [ 'foo3' ] ),
      new Pointer( [ 'foo6' ] ),
    );
    expect( { op : 'move', from : '/foo3', path : '/foo6' } );
  } );

  it( 'should support op "test"', () => {
    patchset.test( '/foo2', { baz : 'bar' } );
    expect( { op : 'test', path : '/foo2', value : { baz : 'bar' } } );
    patchset.test( '/foo3', { baz : 'bar' } );
    expect( { op : 'test', path : '/foo3', value : { baz : 'bar' } } );
  } );

} );
