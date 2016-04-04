/* */ 
var Emitter = require('component-emitter');
var reduce = require('reduce-component');
var requestBase = require('./request-base');
var isObject = require('./is-object');
var root;
if (typeof window !== 'undefined') {
  root = window;
} else if (typeof self !== 'undefined') {
  root = self;
} else {
  root = this;
}
function noop() {}
;
function isHost(obj) {
  var str = {}.toString.call(obj);
  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}
var request = module.exports = require('./request').bind(null, Request);
request.getXHR = function() {
  if (root.XMLHttpRequest && (!root.location || 'file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {}
  }
  return false;
};
var trim = ''.trim ? function(s) {
  return s.trim();
} : function(s) {
  return s.replace(/(^\s*|\s*$)/g, '');
};
function serialize(obj) {
  if (!isObject(obj))
    return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pushEncodedKeyValuePair(pairs, key, obj[key]);
    }
  }
  return pairs.join('&');
}
function pushEncodedKeyValuePair(pairs, key, val) {
  if (Array.isArray(val)) {
    return val.forEach(function(v) {
      pushEncodedKeyValuePair(pairs, key, v);
    });
  }
  pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
}
request.serializeObject = serialize;
function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;
  for (var i = 0,
      len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }
  return obj;
}
request.parseString = parseString;
request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};
request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': JSON.stringify
};
request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};
function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;
  lines.pop();
  for (var i = 0,
      len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }
  return fields;
}
function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}
function type(str) {
  return str.split(/ *; */).shift();
}
;
function params(str) {
  return reduce(str.split(/ *; */), function(obj, str) {
    var parts = str.split(/ *= */),
        key = parts.shift(),
        val = parts.shift();
    if (key && val)
      obj[key] = val;
    return obj;
  }, {});
}
;
function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  this.text = ((this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined') ? this.xhr.responseText : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD' ? this.parseBody(this.text ? this.text : this.xhr.response) : null;
}
Response.prototype.get = function(field) {
  return this.header[field.toLowerCase()];
};
Response.prototype.setHeaderProperties = function(header) {
  var ct = this.header['content-type'] || '';
  this.type = type(ct);
  var obj = params(ct);
  for (var key in obj)
    this[key] = obj[key];
};
Response.prototype.parseBody = function(str) {
  var parse = request.parse[this.type];
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
};
Response.prototype.setStatusProperties = function(status) {
  if (status === 1223) {
    status = 204;
  }
  var type = status / 100 | 0;
  this.status = this.statusCode = status;
  this.statusType = type;
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type) ? this.toError() : false;
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};
Response.prototype.toError = function() {
  var req = this.req;
  var method = req.method;
  var url = req.url;
  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;
  return err;
};
request.Response = Response;
function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function() {
    var err = null;
    var res = null;
    try {
      res = new Response(self);
    } catch (e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
      return self.callback(err);
    }
    self.emit('response', res);
    if (err) {
      return self.callback(err, res);
    }
    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }
    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;
    self.callback(new_err, res);
  });
}
Emitter(Request.prototype);
for (var key in requestBase) {
  Request.prototype[key] = requestBase[key];
}
Request.prototype.abort = function() {
  if (this.aborted)
    return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};
Request.prototype.type = function(type) {
  this.set('Content-Type', request.types[type] || type);
  return this;
};
Request.prototype.responseType = function(val) {
  this._responseType = val;
  return this;
};
Request.prototype.accept = function(type) {
  this.set('Accept', request.types[type] || type);
  return this;
};
Request.prototype.auth = function(user, pass, options) {
  if (!options) {
    options = {type: 'basic'};
  }
  switch (options.type) {
    case 'basic':
      var str = btoa(user + ':' + pass);
      this.set('Authorization', 'Basic ' + str);
      break;
    case 'auto':
      this.username = user;
      this.password = pass;
      break;
  }
  return this;
};
Request.prototype.query = function(val) {
  if ('string' != typeof val)
    val = serialize(val);
  if (val)
    this._query.push(val);
  return this;
};
Request.prototype.attach = function(field, file, filename) {
  this._getFormData().append(field, file, filename || file.name);
  return this;
};
Request.prototype._getFormData = function() {
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};
Request.prototype.send = function(data) {
  var obj = isObject(data);
  var type = this._header['content-type'];
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type)
      this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data ? this._data + '&' + data : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }
  if (!obj || isHost(data))
    return this;
  if (!type)
    this.type('json');
  return this;
};
Response.prototype.parse = function serialize(fn) {
  if (root.console) {
    console.warn("Client-side parse() method has been renamed to serialize(). This method is not compatible with superagent v2.0");
  }
  this.serialize(fn);
  return this;
};
Response.prototype.serialize = function serialize(fn) {
  this._parser = fn;
  return this;
};
Request.prototype.callback = function(err, res) {
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};
Request.prototype.crossDomainError = function() {
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;
  err.status = this.status;
  err.method = this.method;
  err.url = this.url;
  this.callback(err);
};
Request.prototype.timeoutError = function() {
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};
Request.prototype.withCredentials = function() {
  this._withCredentials = true;
  return this;
};
Request.prototype.end = function(fn) {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;
  this._callback = fn || noop;
  xhr.onreadystatechange = function() {
    if (4 != xhr.readyState)
      return;
    var status;
    try {
      status = xhr.status;
    } catch (e) {
      status = 0;
    }
    if (0 == status) {
      if (self.timedout)
        return self.timeoutError();
      if (self.aborted)
        return;
      return self.crossDomainError();
    }
    self.emit('end');
  };
  var handleProgress = function(e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = 'download';
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch (e) {}
  if (timeout && !this._timer) {
    this._timer = setTimeout(function() {
      self.timedout = true;
      self.abort();
    }, timeout);
  }
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?') ? '&' + query : '?' + query;
  }
  if (this.username && this.password) {
    xhr.open(this.method, this.url, true, this.username, this.password);
  } else {
    xhr.open(this.method, this.url, true);
  }
  if (this._withCredentials)
    xhr.withCredentials = true;
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    var contentType = this._header['content-type'];
    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType))
      serialize = request.serialize['application/json'];
    if (serialize)
      data = serialize(data);
  }
  for (var field in this.header) {
    if (null == this.header[field])
      continue;
    xhr.setRequestHeader(field, this.header[field]);
  }
  if (this._responseType) {
    xhr.responseType = this._responseType;
  }
  this.emit('request', this);
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};
request.Request = Request;
request.get = function(url, data, fn) {
  var req = request('GET', url);
  if ('function' == typeof data)
    fn = data, data = null;
  if (data)
    req.query(data);
  if (fn)
    req.end(fn);
  return req;
};
request.head = function(url, data, fn) {
  var req = request('HEAD', url);
  if ('function' == typeof data)
    fn = data, data = null;
  if (data)
    req.send(data);
  if (fn)
    req.end(fn);
  return req;
};
function del(url, fn) {
  var req = request('DELETE', url);
  if (fn)
    req.end(fn);
  return req;
}
;
request['del'] = del;
request['delete'] = del;
request.patch = function(url, data, fn) {
  var req = request('PATCH', url);
  if ('function' == typeof data)
    fn = data, data = null;
  if (data)
    req.send(data);
  if (fn)
    req.end(fn);
  return req;
};
request.post = function(url, data, fn) {
  var req = request('POST', url);
  if ('function' == typeof data)
    fn = data, data = null;
  if (data)
    req.send(data);
  if (fn)
    req.end(fn);
  return req;
};
request.put = function(url, data, fn) {
  var req = request('PUT', url);
  if ('function' == typeof data)
    fn = data, data = null;
  if (data)
    req.send(data);
  if (fn)
    req.end(fn);
  return req;
};
