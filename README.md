# mobx-to-jsonpatch

Watch a [MobX](https://mobx.js.org/) observable and compile a
[JSON Patch](http://jsonpatch.com/) document that represents
the changes made to the observable.

# Installation

NPM: `npm install mobx-to-jsonpatch`

CDN: <https://unpkg.com/mobx-to-jsonpatch>

# Usage

    import { observable } from 'mobx'
    import { Observer } from 'mobx-to-jsonpatch'

    const obj = observable( { name : 'my boring object' } )

    // Create an Observer for whatever observable you want to watch.
    const observer = new Observer( obj )

    // Now you can just make changes to `obj`...
    obj.name = 'my awesome object'

    // ...and they will be reflected in the Patches object that the
    // Observer is building...
    console.log( 'PATCHES:', observer.patches.toJSON() )

    PATCHES: [
      { op : "test", path : "name", value : "my boring object" },
      { op : "replace", path : "name", value : "my awesome object" },
    ]

# Author

Copyright 2019 Jason Kohles - email@jasonkohles.com
