#!/usr/bin/env node
// hack to skip over some ns-package stuff
process.argv.splice(2, 0, '_');
const app = process.argv[2];
const resolve = require('snyk-resolve-deps');
const path = require('path');
const root = process.cwd();
const proxyquire = require('proxyquire');
const graph = proxyquire('ns-package-graph', {
  './lib/generator': proxyquire(__dirname + '/node_modules/ns-package-graph/lib/generator', {
    './nsolid-cli': {
      run: (type, ...rest) => {
        const callback = rest.pop();
        if (type === 'info') {
          return callback(null, [{
            app,
            id: 1,
          }]);
        }

        resolve(root).then(res => {
          const packages = [];

          packages.push(massage(res));
          resolve.walk(res, dep => {
            packages.push(massage(dep));
          });

          callback(null, { packages });
        }).catch(e => console.log(e.stack));
      }
    }
  })
});

function massage(pkg) {
  const resolved = path.resolve(pkg.__filename, '..');
  return {
    path: resolved,
    name: pkg.name,
    version: pkg.version,
    dependencies: Object.keys(pkg.dependencies).map(_ => {
      return path.relative(resolved, path.resolve(pkg.dependencies[_].__filename, '..'));
    }),
    modules: []
  };
}
