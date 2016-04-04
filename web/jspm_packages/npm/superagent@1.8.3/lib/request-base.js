/* */ 
(function(Buffer) {
  var isObject = require('./is-object');
  exports.clearTimeout = function _clearTimeout() {
    this._timeout = 0;
    clearTimeout(this._timer);
    return this;
  };
  exports.parse = function parse(fn) {
    this._parser = fn;
    return this;
  };
  exports.timeout = function timeout(ms) {
    this._timeout = ms;
    return this;
  };
  exports.then = function then(fulfill, reject) {
    return this.end(function(err, res) {
      err ? reject(err) : fulfill(res);
    });
  };
  exports.use = function use(fn) {
    fn(this);
    return this;
  };
  exports.get = function(field) {
    return this._header[field.toLowerCase()];
  };
  exports.getHeader = exports.get;
  exports.set = function(field, val) {
    if (isObject(field)) {
      for (var key in field) {
        this.set(key, field[key]);
      }
      return this;
    }
    this._header[field.toLowerCase()] = val;
    this.header[field] = val;
    return this;
  };
  exports.unset = function(field) {
    delete this._header[field.toLowerCase()];
    delete this.header[field];
    return this;
  };
  exports.field = function(name, val) {
    this._getFormData().append(name, val);
    return this;
  };
})(require('buffer').Buffer);
