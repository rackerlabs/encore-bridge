'use strict';

const Transform = require('stream').Transform;
const vinylFs = require('vinyl-fs');

const read = (dir, opts) => vinylFs.src(`${dir}/**/*.*`, Object.assign({ base: dir }, opts));

exports.read = read;

exports.mount = (dir, opts) => read(dir, opts).pipe(new FSLayer(dir));

class FSLayer extends Transform {
  constructor(dir) {
    super({ readableObjectMode: true, writableObjectMode: true });
    this._cache = {};
    this._mountedDir = dir;
  }

  _isNew(file) {
    return `${process.cwd()}/${this._mountedDir}/${file.relative}` === file.path;
  }

  _transform(file, encoding, next) {
    const cached = this._cache[file.relative];
    const cache = (val) => this._cache[file.relative] = val;
    const clear = () => cache(null);
    const send = (f) => this.push(f);
    const wait = () => cache(file);

    if (cached) {
      if (this._isNew(file)) {
        clear();
        file.history.unshift(cached.path);
        send(file);
      } else {
        clear();
        cached.history.unshift(file.path);
        send(cached);
      }
    } else {
      wait();
    }

    next();
  }

  _flush(done) {
    Object.keys(this._cache).forEach((key) => {
      const file = this._cache[key];
      if (file !== null) {
        this.push(file);
      };
    });
    done();
  }

  end() { this._readyToEnd ? super.end() : this._readyToEnd = true; }
}
