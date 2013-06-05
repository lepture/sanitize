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
  'code': []
}


function sanitize(html, whitelist) {
  whitelist = whitelist || defaults;

  html = cleanEmpty(html);
  html = unwrap(html, 'span');
  html = unwrap(html, 'font');
  html = unwrap(html, 'div');
  html = replaceTag(html, 'i', 'em');
  html = replaceTag(html, 'b', 'strong');

  var div = document.createElement('div');
  div.innerHTML = html;

  for (var i = 0; i < div.childNodes.length; i++) {
    (function(node) {
      if (node.nodeType === document.TEXT_NODE) {
        return;
      }
      if (node.nodeType !== document.ELEMENT_NODE) {
        return div.removeChild(node);
      }
      var tagName = node.nodeName.toLowerCase();
      if (whitelist.hasOwnProperty(tagName)) {
        var allowAttrs = whitelist[tagName];
        trimAttributes(node, allowAttrs);
      } else {
        div.removeChild(node);
      }
    })(div.childNodes[i]);
  }

  return cleanEmpty(div.innerHTML);
}

function trimAttributes(node, allowAttrs) {
  for (var i = 0; i < node.attributes.length; i++) {
    (function(attr) {
      if (!~allowAttrs.indexOf(attr.name)) {
        node.removeAttributeNode(attr);
      }
    })(node.attributes[i]);
  }
  return node;
}

function cleanEmpty(html) {
  var regex = /<(\w+)[^>]*>\s*<\/\1>/g;
  return html.replace(regex, '');
}

function replaceTag(html, orig, repl) {
  var regex;
  regex = new RegExp('<' + orig + '[^>]*>', 'g');
  html = html.replace(regex, '<' + repl + '>');
  regex = new RegExp('</' + orig + '>', 'g');
  html = html.replace(regex, '</' + repl + '>');
  return html;
}

function unwrap(html, tag) {
  var regex = new RegExp('</?' + tag + '[^>]*>', 'g');
  return html.replace(regex, '');
}

sanitize.defaults = defaults;

module.exports = sanitize;
