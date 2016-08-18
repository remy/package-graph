# package-graph

This is a shim of [ns-package-graph](https://github.com/pmuellr/ns-package-graph) that makes it work against the local package directory.

By no means do I intend to take credit, I just hijacked the package and dynamically modify it for my own use.

## installation

```
npm install -g https://github.com/remy/package-graph.git
```

## usage

```
package-graph [options]
```

## deltas

The difference between this and the original ns-package-graph is (obviously) it's running from your locally installed packages, but it shows you the logical tree, not the tree from disk (though this is simple to add at some point).

## unknowns

I've only tested basic support for this, and I'm not totally sure that tweaking the `--child` and `--group` options works or not.

## how

Pretty simple. I include the `ns-package-graph` as a dependency, but instead of using `require`, I used [proxyquire](https://www.npmjs.com/package/proxyquire) and I intercept the `nsolid-cli` load.

I return my own object with a `run` method that walks the local dependencies and then massages the data into the [format](https://git.io/v6iYf) that the `ns-package-graph` wants.
