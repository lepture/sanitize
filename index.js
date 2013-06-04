var $ = require('jquery');

var defaults = {
  // keep attributes
  'h1': [],
  'h2': [],
  'h3': [],
  'h4': [],
  'h5': [],
  'h6': [],
  'p': [],
  'a': ['href'],
  'img': ['src'],
  'strong': [],
  'em': [],
  'hr': [],
  'br': [],
  'blockquote': [],
  'ul': [],
  'ol': [],
  'li': [],
  'pre': [],
  'code': [],

  // null means unwrap
  'span': null,
  'font': null,

  // string means replace tag
  'div': 'p',
  'i': 'em',
  'b': 'strong'
}

function sanitize(html, whitelist) {
  whitelist = whitelist || defaults;
  var output = $('<div>' + html + '</div>');
  output.find('*').each(function() {
    var tagName = this.nodeName.toLowerCase();
    if (whitelist.hasOwnProperty(tagName)) {
      var ret = whitelist[tagName];
      if (ret === null) {
        var node = $(this);
        node.replaceWith(sanitize(node.html(), whitelist));
      } else if ($.isArray(ret)) {
        trimAttributes(this, ret);
      } else {
        var node = $(this);
        var el = document.createElement(ret);
        el.innerHTML = sanitize(node.html(), whitelist);
        node.replaceWith(el);
      }
    } else {
      $(this).remove();
    }
  });
  return output.html();
}

function trimAttributes(node, allowAttrs) {
  $.each(node.attributes, function() {
    var attrName = this.name;
    if ($.inArray(attrName, allowAttrs) === -1) {
      node.removeAttribute(attrName);
    }
  });
  return node;
}

sanitize.defaults = defaults;

module.exports = sanitize;
