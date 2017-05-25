# Fuse-Async

Add-on for [fuse-box] in order to lazy-load on client-side and have a finer control than a whole bundle to throw to the client.

## Server-side

"Server-side" refers to the one that does the bundleing (usually node.js) This one can use two plugins to retrieve the dependencies of a bundle.

1. `DepsGrabber` allows the bundler to have the dependencies at bundleing-time. It is constructed with a basket (an object that will receive the dependencies) or a callback (for each dependencies) so that the values can be used after bundleing (on-complete).
2. `DepsMeta` will allow the client to have the dependencies at run-time. If a file is bundled with this plugin, one can call the following to have a list of dependencies without importing the module per se.
```typescript
var dependencyArray = FuseBox.import('package/module', {meta: true}).file.meta.dependencies;
```

## Client-side

"Client-side" refers to the one that uses the bundled modules (this can be the browser or node)

1. `Lazy` is an object that is created with two callbacks (to lazy-load a package or a file). Once instanciated, this object can be used instead of `FuseBox` to import lazily - ie. returning a `Promise<exports>` instead of `exports`.

It contains the logic to surround the two loaders (package/file) that gives a promise out of a name to make sure these are never called twice and every partial result is cached.

The given loaders (package/file) must return a promise whose resolution values are ignored. Their role is to register the given package/file with fuse-box.

## Imports

There are two ways to import as the two sides have quite separate functionalities

```typescript
import {client, server} from 'fuse-async'

... client.Lazy;
... server.DepsGrabberPlugin;
... server.DepsMetaPlugin;

```

```typescript
import {Lazy} from 'fuse-async/client'
import {DepsGrabberPlugin, DepsMetaPlugin} from 'fuse-async/server'
```

### Seed

If a module is bundled with `DepsMetaPlugin`, its auto-exec file wil be loaded syncronously! if you want an async auto-exec, you will have to implement it in `lazyLoadPackage`.

```typescript
import {Lazy} from 'fuse-async/client'
import * as load from 'load-script'

function lazyLoadPackage(name) {
	return new Promise((resolve, reject)=> {
		load('/mypackages/'+name, (err, script) => {
			if(err) reject(err);
			else {
				let autoexec = name+'/async-index.js';
				// The package should have been loaded. If not, FuseBox.exists will throw - that is the expected behaviour
				(FuseBox.exists(autoexec) ? lazy.load(autoexec) : Promise.resolve())
					.then(resolve);	//The resolution value is ignored
			}
		});
	}
}
var lazy = new Lazy({lazyLoadPackage});
lazy.load('myPackage');

```