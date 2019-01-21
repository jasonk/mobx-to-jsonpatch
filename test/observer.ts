import { Observer } from '../src/Observer';
import { observable } from 'mobx';

describe( 'Observer', () => {

  let obj: any = null;
  let observer: Observer = null;
  let expectations = [];
  function expect( ...x ) {
    expectations.push( ...x );
    observer.toJSON().should.eql( expectations )
  }
  beforeEach( () => {
    obj = observable( {} )
    observer = new Observer( obj )
    expectations = [];
  } );
  afterEach( () => observer.dispose() )

  it( 'should be able to build', () => {
    observer.should.be.an( 'object' )
    observer.should.be.an.instanceOf( Observer )
    expect();
    obj.one = "foo"
    expect(
      { op : 'add', path : '/one', value : 'foo' },
    );
    obj.two = { three : [ 'four'  ] };
    expect(
      { op : 'add', path : '/two', value : { three : [ 'four' ] } },
    );
    obj.two.three.push( 'five', 'six' )
    expect(
      { op : 'add', path : '/two/three/1', value : 'five' },
      { op : 'add', path : '/two/three/2', value : 'six' },
    );
    obj.two.three.splice( 1, 1 )
    expect(
      { op : 'test', path : '/two/three/1', value : 'five' },
      { op : 'remove', path : '/two/three/1' },
    );
    obj.two.three.splice( 1, 2, 'thing1', 'thing2' )
    expect(
      { op : 'test', path : '/two/three/1', value : 'six' },
      { op : 'remove', path : '/two/three/1' },
      { op : 'add', path : '/two/three/1', value : 'thing1' },
      { op : 'add', path : '/two/three/2', value : 'thing2' },
    )
    obj.one = "bar"
    expect(
      { op : 'test', path : '/one', value : 'foo' },
      { op : 'replace', path : '/one', value : 'bar' },
    )
    obj.two.three[ 0 ] = "blahblahblah"
    expect(
      { op : 'test', path : '/two/three/0', value : 'four' },
      { op : 'replace', path : '/two/three/0', value : 'blahblahblah' },
    )
    delete obj.one
    expect(
      { op : 'test', path : '/one', value : 'bar' },
      { op : 'remove', path : '/one' },
    )
  } );

  it( 'should throw an error on non-obserable argument', () => {
    const x = () => new Observer( {} );
    x.should.throw();
  } );

  it( 'should throw on circular data', () => {
    function x() { obj.one = {}; obj.one.two = obj.one; }
    x.should.throw()

    function y() { obj.one = []; obj.one.push( obj.one ); }
    y.should.throw()
  } );

  it( 'should not throw when trying to observe the same thing twice', () => {
    obj.sub = {};
    function x() { observer.observeRecursively( obj.sub, obj, "sub" ); }
    x.should.not.throw();
  } );
} );
