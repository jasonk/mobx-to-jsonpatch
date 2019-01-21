import { Pointer } from './Pointer'
import { parts } from './utils'

type IPatchOp = "add" | "remove" | "replace" | "copy" | "move" | "test"
type IPatch = {
  op: IPatchOp
  path: (Pointer|string)
  from?: (Pointer|string)
  value?: any
}
type IPatchOpJSON = {
  op: IPatchOp
  path: string
  from?: string
  value?: any
}

function clone( obj: any ): any {
  return JSON.parse( JSON.stringify( obj ) )
}

class PatchesOp {

  op: (IPatchOp|string)
  path: Pointer
  from?: Pointer
  value?: any

  constructor( data: IPatch ) {
    this.op = data.op;
    if ( data.path instanceof Pointer ) {
      this.path = data.path;
    } else {
      this.path = new Pointer( data.path );
    }

    if ( this.hasFrom() ) {
      if ( data.from instanceof Pointer ) {
        this.from = data.from;
      } else {
        this.from = new Pointer( data.from );
      }
    }
    if ( this.hasValue() ) this.value = clone( data.value );
  }

  hasFrom() {
    return this.op === "copy" || this.op === "move"
  }

  hasValue() {
    return this.op === "add" || this.op === "replace" || this.op === "test"
  }

  toJSON(): IPatchOpJSON {
    const res: IPatchOpJSON = {
      op : this.op as IPatchOp,
      path : this.path.toString()
    }
    if ( this.hasFrom() ) res.from = this.from.toString();
    if ( this.hasValue() ) res.value = this.value;
    return res;
  }
}

export class Patches {

  patches: PatchesOp[]

  constructor( patches: IPatch[] = [] ) {
    this.patches = patches.map( patch => new PatchesOp( patch ) );
  }

  op( patch: IPatch ) {
    this.patches.push( new PatchesOp( patch ) )
  }

  add( path: (Pointer|string), value: any ): void {
    if ( typeof path === 'string' ) path = new Pointer( path );
    this.op( { op : 'add', path, value } )
  }
  remove( path: (Pointer|string) ): void {
    if ( typeof path === 'string' ) path = new Pointer( path );
    this.op( { op : 'remove', path } )
  }
  replace( path: (Pointer|string), value: any ): void {
    if ( typeof path === 'string' ) path = new Pointer( path );
    this.op( { op : 'replace', path, value } )
  }
  copy( from: (Pointer|string), path: (Pointer|string) ): void {
    if ( typeof path === 'string' ) path = new Pointer( path );
    if ( typeof from === 'string' ) from = new Pointer( from );
    this.op( { op : 'copy', from, path } )
  }
  move( from: (Pointer|string), path: (Pointer|string) ): void {
    if ( typeof path === 'string' ) path = new Pointer( path );
    if ( typeof from === 'string' ) from = new Pointer( from );
    this.op( { op : 'move', from, path } )
  }
  test( path: (Pointer|string), value: any ): void {
    if ( typeof path === 'string' ) path = new Pointer( path );
    this.op( { op : 'test', path, value } )
  }

  toJSON(): IPatchOpJSON[] {
    return this.patches.map( patch => patch.toJSON() )
  }

}
