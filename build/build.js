
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("sanitize/index.js", function(exports, require, module){
var config = {
  keep: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'div', 'p', 'blockquote', 'figure', 'figcaption',
    'ul', 'ol', 'li',
    'pre', 'code',
    'em', 'strong', 'i', 'b',
    'a', 'img', 'hr', 'br',
    'table', 'td', 'th', 'tr', 'tbody', 'thead', 'tfoot'
  ],

  drop: [
    'meta', 'link',
    'script', 'noscript', 'style',
    'embed', 'iframe', 'frame',
    'form', 'input', 'textarea', 'button', 'fieldset'
  ],

  replace: {
    'div': 'p',
    'i': 'em',
    'b': 'strong'
  },

  attributes: {
    '*': [],
    'a': ['href'],
    'img': ['src', 'width', 'height']
  }
};


/**
 * Replace node tag name
 */

function replaceTag(node, tagName) {
  var repl = document.createElement(tagName);
  repl.innerHTML = node.innerHTML;
  node.parentNode.replaceChild(repl, node);
  return repl;
}


/**
 * Trim node attributes
 */

function trimAttributes(node, allowAttrs) {
  allowAttrs = allowAttrs.concat(config.attributes['*']);

  // clone all attrs
  var attrs = Array.prototype.slice.call(node.attributes);

  for (var i = 0; i < attrs.length; i++) {
    (function(attr) {
      if (!~allowAttrs.indexOf(attr.name)) {
        node.removeAttributeNode(attr);
      }
    })(attrs[i]);
  }
  return node;
}


/**
 * Remove this node
 */

function dropNode(node) {
  node.parentNode.removeChild(node);
}


/**
 * Remove the tag of the node
 */

function unwrap(node) {
  var parent = node.parentNode;
  if (!parent) {
    return;
  }
  var children = node.childNodes;
  for (var i = 0; i < children.length; i++) {
    parent.insertBefore(children[i], node);
  }
  parent.removeChild(node);
}


/**
 * Traversal the node tree
 */

function traversal(node, fn, parent) {
  if (!node) {
    return;
  }

  var children = node.childNodes;

  for (var i = 0; i < children.length; i++) {
    fn(children[i]);
    traversal(children[i], fn, node);
  }

  if (parent) {
    fn(node);
  }

  return node;
}


/**
 * Sanitize a node, clean the disaster
 */

function sanitize(node) {
  if (node.nodeType === document.TEXT_NODE) {
    return node;
  }

  if (node.nodeType !== document.ELEMENT_NODE) {
    return dropNode(node);
  }

  var tag = node.nodeName.toLowerCase();
  if (~config.drop.indexOf(tag)) {
    return dropNode(node);
  }
  if (!~config.keep.indexOf(tag)) {
    return unwrap(node);
  }

  if (config.replace[tag]) {
    node = replaceTag(node, config.replace[tag]);
  }

  trimAttributes(node, config.attributes[tag] || []);
  return node;
}


/**
 * Clean empty node
 */

function cleanEmpty(html) {
  var regex = /<(\w+)[^>]*><\/\1>/g;
  return html.replace(regex, '');
}


/**
 * Exports sanitize API
 */

exports = module.exports = function(html) {
  var node = document.createElement('div');
  node.innerHTML = html;

  node = traversal(node, sanitize);
  return cleanEmpty(node.innerHTML);
};


/**
 * Exports config data
 */

exports.config = config;

});