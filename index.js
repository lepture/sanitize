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


function sanitize(container, whitelist) {
  whitelist = whitelist || defaults;

  var rubbish = [];

  for (var i = 0; i < container.childNodes.length; i++) {
    (function(node) {
      if (node.nodeType === document.TEXT_NODE) {
        return;
      }
      if (node.nodeType !== document.ELEMENT_NODE) {
        rubbish.push(node);
        return;
      }
      var tagName = node.nodeName.toLowerCase();
      if (whitelist.hasOwnProperty(tagName)) {
        var allowAttrs = whitelist[tagName];
        trimAttributes(node, allowAttrs);
        sanitize(node, whitelist);
      } else {
        rubbish.push(node);
      }
    })(container.childNodes[i]);
  }

  for (var i = 0; i < rubbish.length; i++) {
    container.removeChild(rubbish[i]);
  }

  return container;
}

function trimAttributes(node, allowAttrs) {
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

exports = module.exports = function(html, whitelist) {
  html = cleanEmpty(html);
  html = unwrap(html, 'span');
  html = unwrap(html, 'font');
  html = unwrap(html, 'div');
  html = replaceTag(html, 'i', 'em');
  html = replaceTag(html, 'b', 'strong');
  var div = document.createElement('div');
  div.innerHTML = html;
  sanitize(div, whitelist);
  return cleanEmpty(div.innerHTML);
};
