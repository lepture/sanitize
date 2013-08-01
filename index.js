var config = {
  keep: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'div', 'p', 'blockquote',
    'ul', 'ol', 'li',
    'pre', 'code',
    'em', 'strong', 'i', 'b',
    'a', 'img', 'hr',
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
  var html = parent.innerHTML;
  var regex = new RegExp('</?' + node.tagName + '[^>]*>', 'gi');
  parent.innerHTML = html.replace(regex, '');
}


/**
 * Traversal the node tree
 */

function traversal(node, fn, parent) {
  if (!node) {
    return;
  }

  if (!parent && node.childNodes.length > 1) {
    // <br><a>foo</a>
    // don't know why, the for loop will skip `a`
    fn(node.childNodes[1]);
  }

  var children = node.childNodes;

  for (var i = 0; i < children.length; i++) {
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
  var regex = /<(\w+)[^>]*>\s*<\/\1>/g;
  return html.replace(regex, '');
}


/**
 * Exports sanitize API
 */

exports = module.exports = function(html) {
  var node = document.createElement('div');
  node.innerHTML = cleanEmpty(html);

  node = traversal(node, sanitize);
  return cleanEmpty(node.innerHTML);
}


/**
 * Exports config data
 */

exports.config = config;
