import _ from 'lodash';
import * as chai from 'chai';
import { observable, $mobx } from 'mobx'

/*
// TODO - Supposedly this is the right way to do this, but I can't
// figure out how to make it work.
declare module NodeJS {
  interface Global {
    _: any
    chai: any
    should: any
    expect: any
  }
}
*/
// TODO - This is the ugly "hide the types" brute-force solution until
// I figure out the above
declare let global: any
global._ = _;
global.chai = chai;
global.should = chai.should();
global.expect = chai.expect;
