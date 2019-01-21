import { part, parts, Entry } from './utils';

/**
 * This is a simple representation of a
 * [JSON Pointer](https://tools.ietf.org/html/rfc6901) as defined in
 * RFC 6901.
 */
export class Pointer {

  /** @hidden */
  parts: parts

  constructor( parts: (parts|string) ) {
    this.parts = Array.isArray( parts ) ? parts : decodePath( parts );
  }

  /**
   * Create a new [[Pointer]] from a string that contains a JSON Patch
   * style path specification.
   */
  static fromJSONPatch( path: string ): Pointer {
    return new this( decodePath( path ) )
  }

  /**
   * Create a new [[Pointer]] from an array of path elements.
   */
  static fromArray( parts: parts ): Pointer {
    return new this( parts )
  }

  /**
   * Create a new [[Pointer]] from an [[Observer]] entry
   * @hidden
   */
  static fromEntry( entry: Entry, name?: string|number ): Pointer {
    name = String( name )
    const parts: parts = []
    if ( name ) parts.push( name )
    while ( entry.parent ) {
      parts.push( entry.path )
      entry = entry.parent
    }
    return new this( parts.reverse() )
  }

  /**
   * Produce a JSON Patch style path specifier
   */
  toJSONPatch(): string { return encodePath( this.parts ) }

  toJSON(): string { return this.toJSONPatch() }
  toString(): string { return this.toJSONPatch() }


}

export function encodePart( part: part ): string {
  return String( part ).replace( /~/gu, '~0' ).replace( /\//gu, '~1' )
}
export function encodePath( parts: parts ): string {
  return '/' + parts.map( encodePart ).join( '/' )
}
export function decodePart( part: string ): string {
  return part.replace( /~1/gu, '/' ).replace( /~0/gu, '~' )
}
export function decodePath( path: string ): string[] {
  return path.replace( /^\//u, '' ).split( '/' ).map( decodePart )
}
