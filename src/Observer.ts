import { observe, isObservable, values, entries } from "mobx"
import { Pointer } from './Pointer'
import { Patches } from './Patches'
import { part, parts, Entry, IChange } from './utils'

/**
 * Watch a MobX Observable and compile a JSON Patch document that
 * represents the changes made to the observable.
 */
export class Observer {

  /**
   * The root observable object, it will be watched recursively.
   */
  root: any

  /**
   * The [[Patches]] object that contains the actual JSON Patch
   * document.
   */
  patches: Patches

  /** @hidden */
  entryset: WeakMap<any, Entry>

  constructor( root: any ) {
    if ( ! isObservable( root ) ) {
      throw new TypeError( `Observer root is not observable` );
    }
    this.entryset = new WeakMap()
    this.patches = new Patches();
    this.root = root;
    this.observeRecursively( this.root, undefined, "" )
  }

  /**
   * Dispose of this Observer, and stop observing the observable
   * that it is associated with.
   */
  dispose() { this.unobserveRecursively( this.root ) }

  /**
   * A generic listener for processing change events.
   * @hidden
   */
  genericListener = ( change: IChange ) => {
    const entry = this.entryset.get( change.object );
    this.processChange( change, entry );
  }

  /**
   * Process a change event from a MobX observer.
   *
   * @param change The change event from `observe`
   * @param parent The Entry of the parent object
   *
   * @hidden
   */
  processChange( change: IChange, parent: Entry ) {
    if ( change.type === "add" ) {
      const { name, newValue } = change;
      this.observeRecursively( newValue, parent, name )
      this.patches.add( Pointer.fromEntry( parent, name ), newValue );
    } else if ( change.type === "update" ) {
      const { newValue, oldValue } = change;
      const name = ( change as any ).name || ( change as any ).index
      this.unobserveRecursively( oldValue )
      this.observeRecursively( newValue, parent, name )
      const path = Pointer.fromEntry( parent, name );
      this.patches.test( path, oldValue );
      this.patches.replace( path, newValue );
    } else if ( change.type === "remove" || change.type === "delete" ) {
      const { name, oldValue } = change;
      this.unobserveRecursively( oldValue )
      const path = Pointer.fromEntry( parent, name );
      this.patches.test( path, oldValue );
      this.patches.remove( path );
    } else if ( change.type === "splice" ) {
      const {
        index, removedCount, added, removed, addedCount, object,
      } = change;
      removed.forEach( x => this.unobserveRecursively( x ) )
      added.forEach( ( value, idx ) => {
        this.observeRecursively( value, parent, index + idx )
      } )
      // update paths
      for ( let i = index + addedCount ; i < object.length ; i++ ) {
        const entry = this.entryset.get( change.object[ i ] )
        if ( entry ) entry.path = i
      }
      const subpath = Pointer.fromEntry( parent, index );
      for ( let i = 0 ; i < removedCount ; i++ ) {
        this.patches.test( subpath, removed[ i ] );
        this.patches.remove( subpath );
      }
      for ( let j = 0 ; j < addedCount ; j++ ) {
        const path = Pointer.fromEntry( parent, index + j )
        this.patches.add( path, added[ j ] );
      }
    }
  }

  /**
   * Recurisvely observe a new object, attaching listeners to all it's
   * observable children.
   *
   * @param thing  The object to observe.
   * @param parent The parent Entry of the object.
   * @param path   The name of the property.
   *
   * @hidden
   */
  observeRecursively( thing: any, parent: Entry, path: part ) {
    if ( ! isObservable( thing ) ) return;
    if ( this.entryset.has( thing ) ) {
      const entry = this.entryset.get( thing )
      const newPath = Pointer.fromEntry( parent, path ).toString()
      const oldPath = Pointer.fromEntry( entry.parent, path ).toString()
      if ( newPath === oldPath ) return;
      throw new Error( [
        `The same observable object cannot appear twice in the`,
        `same tree, trying to assign it to '${newPath}', but it`,
        `already exists at '${oldPath}'`,
      ].join( ' ' ) )
    } else {
      const entry: Entry = {
        parent,
        path,
        dispose: observe( thing, this.genericListener )
      }
      this.entryset.set( thing, entry )
      entries( thing ).forEach( ( [ key, value ] ) => {
        this.observeRecursively( value, entry, key );
      } )
    }
  }

  /**
   * Recursively stop observing an object and forget all the
   * references to it.
   *
   * @param thing The object to stop observing.
   *
   * @hidden
   */
  unobserveRecursively( thing: any ) {
    const entry = this.entryset.get( thing )
    if ( ! entry ) return
    this.entryset.delete( thing )
    entry.dispose()
    values( thing ).forEach( x => this.unobserveRecursively( x ) )
  }

  /**
   * Return a straight JSON representation of the patch document.
   */
  toJSON() { return this.patches.toJSON() }

}
